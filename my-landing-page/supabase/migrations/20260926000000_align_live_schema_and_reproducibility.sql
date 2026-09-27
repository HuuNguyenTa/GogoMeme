-- ==============================================================================
-- 20260926000000_align_live_schema_and_reproducibility.sql
-- Trạm Yêu Thương (SSG105) - Backend Consistency & Reproducibility Migration
--
-- Purpose:
-- 1. Aligns public.wishes with the exact verified live database schema (information_schema):
--    - Drops obsolete columns (animal_name, animal_breed, animal_avatar, updated_at).
--    - Aligns column data types to character varying (VARCHAR) for animal_id, animal_type,
--      message, and status; keeps sender_display_name as text.
--    - Sets created_at default to now().
--    - Ensures trimmed message constraint checks:
--        char_length(trim(message)) >= 2 AND char_length(trim(message)) <= 200
--    - Drops the sender_display_name length check constraint (absent in live DB).
--    - Ensures status defaults to 'approved' with constraint ('pending', 'approved', 'rejected').
--    - Updates RLS policies to match live security semantics.
-- 2. Creates definitions for the remaining 3 live tables:
--    - public.rescue_centers (with active RLS)
--    - public.scenarios (with active RLS)
--    - public.project_stats (with active RLS)
--
-- WARNING ON DATA PERSISTENCE:
-- Removing obsolete columns (animal_name, animal_breed, animal_avatar, updated_at) via DROP COLUMN
-- is an intentional destructive schema alignment operation. If applied to a database containing
-- existing values in these columns, those column values will be discarded.
-- In live production, these columns are already absent, and animal profiles are derived from animal_id.
-- ==============================================================================

-- 1. ALIGN public.wishes WITH LIVE CONTRACT
-- In live production, animal metadata is resolved at runtime by the frontend using animal_id.
-- Therefore animal_name, animal_breed, animal_avatar, and updated_at do not exist on public.wishes.

ALTER TABLE public.wishes
    DROP COLUMN IF EXISTS animal_name,
    DROP COLUMN IF EXISTS animal_breed,
    DROP COLUMN IF EXISTS animal_avatar,
    DROP COLUMN IF EXISTS updated_at;

-- Align column types to match live character varying (VARCHAR)
ALTER TABLE public.wishes
    ALTER COLUMN animal_id TYPE VARCHAR,
    ALTER COLUMN animal_type TYPE VARCHAR,
    ALTER COLUMN message TYPE VARCHAR,
    ALTER COLUMN status TYPE VARCHAR;

-- Align created_at default to now()
ALTER TABLE public.wishes
    ALTER COLUMN created_at SET DEFAULT now();

-- Ensure default and constraints for status
ALTER TABLE public.wishes
    ALTER COLUMN status SET DEFAULT 'approved';

ALTER TABLE public.wishes
    DROP CONSTRAINT IF EXISTS wishes_status_check;

ALTER TABLE public.wishes
    ADD CONSTRAINT wishes_status_check
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Ensure constraints for animal_type
ALTER TABLE public.wishes
    DROP CONSTRAINT IF EXISTS wishes_animal_type_check;

ALTER TABLE public.wishes
    ADD CONSTRAINT wishes_animal_type_check
    CHECK (animal_type IN ('cat', 'dog'));

-- Ensure constraint for trimmed message (both min and max trimmed length)
ALTER TABLE public.wishes
    DROP CONSTRAINT IF EXISTS wishes_message_check;

ALTER TABLE public.wishes
    ADD CONSTRAINT wishes_message_check
    CHECK (char_length(trim(message)) >= 2 AND char_length(trim(message)) <= 200);

-- Remove check constraint on sender_display_name length to match live database
-- (where no database-level constraint exists; validation is enforced by frontend)
ALTER TABLE public.wishes
    DROP CONSTRAINT IF EXISTS wishes_sender_display_name_length_check;

-- Update RLS policies on public.wishes to match live rules
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert pending wishes" ON public.wishes;
DROP POLICY IF EXISTS "Public can insert public wishes" ON public.wishes;
DROP POLICY IF EXISTS "Public can insert approved valid wishes" ON public.wishes;

CREATE POLICY "Public can insert approved valid wishes"
ON public.wishes
FOR INSERT
TO public
WITH CHECK (
    status = 'approved'
    AND animal_type IN ('cat', 'dog')
    AND char_length(trim(message)) >= 2
    AND char_length(trim(message)) <= 200
);

DROP POLICY IF EXISTS "Public can view approved wishes only" ON public.wishes;
DROP POLICY IF EXISTS "Public can view public wishes" ON public.wishes;
DROP POLICY IF EXISTS "Public can view approved wishes" ON public.wishes;

CREATE POLICY "Public can view approved wishes"
ON public.wishes
FOR SELECT
TO public
USING (
    status = 'approved'
);

-- Intentionally do not grant UPDATE or DELETE to public roles.

-- 2. DEFINE public.rescue_centers TABLE (EXISTS IN LIVE DATABASE)
CREATE TABLE IF NOT EXISTS public.rescue_centers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    phone TEXT,
    facebook_url TEXT,
    description TEXT,
    verified_date TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rescue_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active rescue centers" ON public.rescue_centers;
CREATE POLICY "Public can view active rescue centers"
ON public.rescue_centers
FOR SELECT
TO public
USING (is_active = true);

-- 3. DEFINE public.scenarios TABLE (EXISTS IN LIVE DATABASE)
CREATE TABLE IF NOT EXISTS public.scenarios (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    principle TEXT,
    context TEXT,
    question TEXT,
    recommended_answer TEXT,
    options JSONB,
    educational_feedback JSONB,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active scenarios" ON public.scenarios;
CREATE POLICY "Public can view active scenarios"
ON public.scenarios
FOR SELECT
TO public
USING (is_active = true);

-- 4. DEFINE public.project_stats TABLE (EXISTS IN LIVE DATABASE)
CREATE TABLE IF NOT EXISTS public.project_stats (
    id TEXT PRIMARY KEY DEFAULT 'current',
    total_wishes TEXT,
    participants TEXT,
    shelters_connected TEXT,
    products_sold TEXT,
    fund_raised TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view project stats" ON public.project_stats;
CREATE POLICY "Public can view project stats"
ON public.project_stats
FOR SELECT
TO public
USING (true);
