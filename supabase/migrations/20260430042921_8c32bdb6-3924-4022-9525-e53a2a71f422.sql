
-- ===== PAGE BLOCKS (Visual Builder) =====
CREATE TABLE public.page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  block_type TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_page_blocks_page ON public.page_blocks(page_slug, position);
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible blocks" ON public.page_blocks
  FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins/editors can view all blocks" ON public.page_blocks
  FOR SELECT TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can insert blocks" ON public.page_blocks
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can update blocks" ON public.page_blocks
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete blocks" ON public.page_blocks
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE TRIGGER trg_page_blocks_updated BEFORE UPDATE ON public.page_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== MEDIA FILES =====
CREATE TABLE public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view media" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Admins/editors can insert media" ON public.media_files
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can update media" ON public.media_files
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete media" ON public.media_files
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));
CREATE TRIGGER trg_media_files_updated BEFORE UPDATE ON public.media_files
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== BLOG CATEGORIES =====
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage categories" ON public.blog_categories
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'))
  WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));

-- ===== BLOG POSTS =====
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status, published_at DESC);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins/editors can view all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== BLOG COMMENTS =====
CREATE TABLE public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved comments" ON public.blog_comments
  FOR SELECT USING (approved = true);
CREATE POLICY "Admins/editors view all comments" ON public.blog_comments
  FOR SELECT TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Anyone can submit a comment" ON public.blog_comments
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(trim(name)) > 0 AND length(trim(content)) > 0 AND length(content) <= 5000);
CREATE POLICY "Admins/editors moderate comments" ON public.blog_comments
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins delete comments" ON public.blog_comments
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- ===== SEO KEYWORDS =====
CREATE TABLE public.seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  target_url TEXT,
  search_volume INTEGER,
  current_rank INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins/editors manage keywords" ON public.seo_keywords
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'))
  WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE TRIGGER trg_seo_keywords_updated BEFORE UPDATE ON public.seo_keywords
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== SEO META =====
CREATE TABLE public.seo_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  no_index BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads seo meta" ON public.seo_meta FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage seo meta" ON public.seo_meta
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'))
  WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'));
CREATE TRIGGER trg_seo_meta_updated BEFORE UPDATE ON public.seo_meta
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== SITE SETTINGS =====
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads public settings" ON public.site_settings
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admins view all settings" ON public.site_settings
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== API KEYS =====
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  masked_value TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage api keys" ON public.api_keys
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE TRIGGER trg_api_keys_updated BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== BACKUPS =====
CREATE TABLE public.backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  backup_type TEXT NOT NULL DEFAULT 'database',
  size_bytes BIGINT,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage backups" ON public.backups
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- ===== STORAGE BUCKET =====
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public media read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins/editors upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor')));
CREATE POLICY "Admins/editors update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (is_admin(auth.uid()) OR has_role(auth.uid(), 'editor')));
CREATE POLICY "Admins delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND is_admin(auth.uid()));

-- Seed default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
  ('Digital Marketing', 'digital-marketing', 'Marketing strategies and tips'),
  ('SEO', 'seo', 'Search engine optimization'),
  ('Social Media', 'social-media', 'Social media marketing'),
  ('AI Tools', 'ai-tools', 'AI in marketing');
