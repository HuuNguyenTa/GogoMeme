-- Publish new wishes immediately while preserving the legacy status column.
-- Existing rejected/pending rows are left untouched to avoid changing historical data.

ALTER TABLE public.wishes
    ALTER COLUMN status SET DEFAULT 'approved';

DROP POLICY IF EXISTS "Public can insert pending wishes" ON public.wishes;
DROP POLICY IF EXISTS "Public can insert public wishes" ON public.wishes;

CREATE POLICY "Public can insert public wishes"
ON public.wishes
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view approved wishes only" ON public.wishes;
DROP POLICY IF EXISTS "Public can view public wishes" ON public.wishes;

CREATE POLICY "Public can view public wishes"
ON public.wishes
FOR SELECT
TO public
USING (true);

-- Intentionally do not create UPDATE or DELETE policies for public roles.

COMMENT ON COLUMN public.wishes.status IS
  'Legacy compatibility field. New wishes are published immediately with status approved.';

-- Ensure INSERT events are broadcast to connected Wish Garden clients.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'wishes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
  END IF;
END $$;
