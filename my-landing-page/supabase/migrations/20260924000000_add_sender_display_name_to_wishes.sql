-- ==============================================================================
-- 20260924000000_add_sender_display_name_to_wishes.sql
-- Trạm Yêu Thương (SSG105) - Wish Garden Database Migration
-- 
-- Description:
-- Adds optional public sender_display_name to public.wishes table.
-- Ensures strict moderation defaults (status = 'pending'),
-- enforces character limits (max 30 characters), and preserves RLS policies.
-- ==============================================================================

-- 1. Ensure public.wishes table exists with clean production schema
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id TEXT NOT NULL,
    animal_name TEXT NOT NULL,
    animal_type TEXT NOT NULL CHECK (animal_type IN ('cat', 'dog')),
    animal_breed TEXT,
    animal_avatar TEXT,
    message TEXT NOT NULL CHECK (char_length(trim(message)) >= 2 AND char_length(message) <= 200),
    sender_display_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Add sender_display_name column idempotently if table already existed without it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'wishes'
          AND column_name = 'sender_display_name'
    ) THEN
        ALTER TABLE public.wishes ADD COLUMN sender_display_name TEXT;
    END IF;
END $$;

-- Keep the existing production table compatible with the frontend write payload.
-- These statements are idempotent and preserve all existing rows.
ALTER TABLE public.wishes
    ADD COLUMN IF NOT EXISTS animal_name TEXT,
    ADD COLUMN IF NOT EXISTS animal_breed TEXT,
    ADD COLUMN IF NOT EXISTS animal_avatar TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

UPDATE public.wishes
SET animal_name = animal_id
WHERE animal_name IS NULL;

ALTER TABLE public.wishes
    ALTER COLUMN animal_name SET NOT NULL;

-- 3. Length constraint on sender_display_name (max 30 characters when provided)
ALTER TABLE public.wishes
    DROP CONSTRAINT IF EXISTS wishes_sender_display_name_length_check;

ALTER TABLE public.wishes
    ADD CONSTRAINT wishes_sender_display_name_length_check
    CHECK (sender_display_name IS NULL OR char_length(trim(sender_display_name)) <= 30);

-- 4. Schema Documentation Comments
COMMENT ON TABLE public.wishes IS 'Community wishes sent to rescued animals in GoGo & MeMe.';
COMMENT ON COLUMN public.wishes.sender_display_name IS 'Optional public display name chosen by sender (max 30 chars). NULL if sender prefers anonymity.';
COMMENT ON COLUMN public.wishes.status IS 'Moderation status: pending (default), approved, or rejected.';

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (anonymous or authenticated) can submit a wish.
-- Constraint: Newly created wishes MUST default to status = 'pending'.
DROP POLICY IF EXISTS "Public can insert pending wishes" ON public.wishes;
CREATE POLICY "Public can insert pending wishes"
ON public.wishes
FOR INSERT
TO public
WITH CHECK (
    status = 'pending'
);

-- Policy 2: Public can only query approved wishes.
-- Ensures other users' pending or rejected wishes remain strictly private and hidden.
DROP POLICY IF EXISTS "Public can view approved wishes only" ON public.wishes;
CREATE POLICY "Public can view approved wishes only"
ON public.wishes
FOR SELECT
TO public
USING (
    status = 'approved'
);

-- 6. Performance Index for Wish Garden querying
CREATE INDEX IF NOT EXISTS idx_wishes_status_created_at
ON public.wishes(status, created_at DESC);
