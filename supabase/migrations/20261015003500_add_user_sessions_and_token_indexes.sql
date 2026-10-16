-- Migration: add_user_sessions_and_token_indexes
-- Description:
-- 1. Create user_sessions table with constraints and RLS
-- 2. Add indexes on user_sessions (token_hash, user_id)
-- 3. Add session capping trigger (max 10 active sessions per user)
-- 4. Add index on users.verification_token
-- 5. Add users.last_link_sent_at column
-- 6. Add case-insensitive unique index on lower(users.email)
-- 7. Reset plaintext verification tokens to NULL

BEGIN;

-- 1. Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  user_agent text
);

-- 2. Indexes on user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON public.user_sessions (token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions (user_id);

-- Enable RLS (no public policies - access restricted to service role / backend)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- 3. Trigger to cap active sessions at 10 per user (revoke oldest)
CREATE OR REPLACE FUNCTION public.cap_user_sessions()
RETURNS trigger AS $$
BEGIN
  UPDATE public.user_sessions
  SET revoked_at = now()
  WHERE id IN (
    SELECT id FROM public.user_sessions
    WHERE user_id = NEW.user_id
      AND revoked_at IS NULL
      AND expires_at > now()
      AND id <> NEW.id
    ORDER BY created_at DESC
    OFFSET 9
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cap_user_sessions ON public.user_sessions;
CREATE TRIGGER trigger_cap_user_sessions
AFTER INSERT ON public.user_sessions
FOR EACH ROW
EXECUTE FUNCTION public.cap_user_sessions();

-- 4. Index on users.verification_token
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON public.users (verification_token);

-- 5. Add last_link_sent_at column to users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS last_link_sent_at timestamptz;

-- 6. Case-insensitive unique index on lower(users.email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_lower_email_unique ON public.users (lower(email));

-- 7. Nullify legacy plaintext verification tokens (incompatible with SHA-256 hash lookup)
UPDATE public.users
SET verification_token = NULL,
    token_expires_at = NULL
WHERE verification_token IS NOT NULL;

COMMIT;
