const token = "sbp_oauth_32c7c9804edf01a39cdec62f869924dab3ba27d6";
const projectRef = "uekaerhvlgooeikycnly";

async function query(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Supabase query error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  console.log("Applying schema enhancements to public.users...");

  const sql = `
    -- 1. Add missing columns
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name text;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

    -- 2. Backfill existing rows
    UPDATE public.users SET verified = COALESCE(is_verified, false) WHERE verified IS NULL OR verified IS DISTINCT FROM is_verified;
    UPDATE public.users SET is_verified = COALESCE(verified, false) WHERE is_verified IS NULL OR is_verified IS DISTINCT FROM verified;

    -- 3. Bi-directional sync trigger for verified and is_verified
    CREATE OR REPLACE FUNCTION public.sync_user_verified_columns()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        IF NEW.verified IS NOT NULL AND NEW.is_verified IS NULL THEN
          NEW.is_verified := NEW.verified;
        ELSIF NEW.is_verified IS NOT NULL AND NEW.verified IS NULL THEN
          NEW.verified := NEW.is_verified;
        END IF;
      ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.verified IS DISTINCT FROM OLD.verified THEN
          NEW.is_verified := NEW.verified;
        ELSIF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
          NEW.verified := NEW.is_verified;
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_sync_user_verified ON public.users;
    CREATE TRIGGER trg_sync_user_verified
    BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_user_verified_columns();

    -- 4. Upsert trigger on INSERT
    CREATE OR REPLACE FUNCTION public.handle_user_insert_upsert()
    RETURNS TRIGGER AS $$
    DECLARE
      v_existing_id uuid;
    BEGIN
      SELECT id INTO v_existing_id FROM public.users WHERE lower(email) = lower(NEW.email);
      IF v_existing_id IS NOT NULL THEN
        UPDATE public.users
        SET
          name = COALESCE(NEW.name, users.name),
          city = COALESCE(NEW.city, users.city),
          country_code = COALESCE(NEW.country_code, users.country_code),
          news_categories = COALESCE(NEW.news_categories, users.news_categories),
          weather_categories = COALESCE(NEW.weather_categories, users.weather_categories),
          send_time = COALESCE(NEW.send_time, users.send_time),
          verification_token = COALESCE(NEW.verification_token, users.verification_token),
          token_expires_at = COALESCE(NEW.token_expires_at, users.token_expires_at),
          is_verified = COALESCE(NEW.is_verified, users.is_verified),
          verified = COALESCE(NEW.verified, users.verified),
          onboarding_completed = COALESCE(NEW.onboarding_completed, users.onboarding_completed)
        WHERE id = v_existing_id;
        RETURN NULL;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_user_insert_upsert ON public.users;
    CREATE TRIGGER trg_user_insert_upsert
    BEFORE INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_insert_upsert();
  `;

  const result = await query(sql);
  console.log("Migration executed successfully:", result);

  // Verify columns now present
  const cols = await query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
    ORDER BY ordinal_position;
  `);
  console.log("Updated Columns:", cols);
}

run().catch(console.error);
