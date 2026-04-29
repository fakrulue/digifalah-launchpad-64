
-- Lock down internal trigger functions (not meant to be called via API)
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Replace the overly permissive INSERT policy on leads with one that requires name + phone
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

CREATE POLICY "Anyone can submit a valid lead"
ON public.leads FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(phone)) > 0
  AND length(name) <= 200
  AND length(phone) <= 50
);
