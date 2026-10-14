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
  return res.json();
}

async function run() {
  await query(`
    CREATE TABLE IF NOT EXISTS public.test_dummy (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      val text
    );

    CREATE OR REPLACE FUNCTION public.test_dummy_upsert()
    RETURNS TRIGGER AS $$
    BEGIN
      IF EXISTS (SELECT 1 FROM public.test_dummy WHERE email = NEW.email) THEN
        UPDATE public.test_dummy SET val = NEW.val WHERE email = NEW.email;
        RETURN NULL;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_test_dummy ON public.test_dummy;
    CREATE TRIGGER trg_test_dummy
    BEFORE INSERT ON public.test_dummy
    FOR EACH ROW
    EXECUTE FUNCTION public.test_dummy_upsert();
  `);

  console.log("Trigger created. Now testing via PostgREST...");
  const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVla2Flcmh2bGdvb2Vpa3ljbmx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTMwMDI2MiwiZXhwIjoyMTA2ODc2MjYyfQ.JSqotaGCvJ5PSwpf2FGIjHbLnL8jXAKLMpgEXDaOVoE";

  // First insert
  const r1 = await fetch(`https://${projectRef}.supabase.co/rest/v1/test_dummy`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ email: "hello@example.com", val: "v1" })
  });
  console.log("Insert 1 status:", r1.status, await r1.text());

  // Second insert (duplicate)
  const r2 = await fetch(`https://${projectRef}.supabase.co/rest/v1/test_dummy`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ email: "hello@example.com", val: "v2" })
  });
  console.log("Insert 2 status:", r2.status, await r2.text());

  // Check table contents
  const rows = await query(`SELECT * FROM public.test_dummy;`);
  console.log("Table rows:", rows);

  // Clean up
  await query(`DROP TABLE public.test_dummy CASCADE;`);
}

run().catch(console.error);
