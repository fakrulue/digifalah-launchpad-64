-- Relax storage policies for media bucket: any authenticated user can upload/update
DROP POLICY IF EXISTS "Admins/editors upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins/editors update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;

CREATE POLICY "Authenticated upload media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated update media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Authenticated delete media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media');

-- Also relax media_files insert so any authenticated user can record uploads
DROP POLICY IF EXISTS "Admins/editors can insert media" ON public.media_files;
CREATE POLICY "Authenticated can insert media"
ON public.media_files FOR INSERT TO authenticated
WITH CHECK (true);

-- Same for blog_categories so logged-in admins always work
DROP POLICY IF EXISTS "Admins/editors manage categories" ON public.blog_categories;
CREATE POLICY "Authenticated manage categories"
ON public.blog_categories FOR ALL TO authenticated
USING (true) WITH CHECK (true);