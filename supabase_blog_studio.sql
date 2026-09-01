-- Khadafi Blog Studio: articles, RLS, and public media bucket.
-- Run this once in the Supabase SQL Editor before opening /studio.

CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL DEFAULT 'Untitled story',
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content_json JSONB NOT NULL DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  content_html TEXT NOT NULL DEFAULT '<p></p>',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  category TEXT NOT NULL DEFAULT 'Ideas',
  cover_url TEXT NOT NULL DEFAULT '',
  cover_slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme TEXT NOT NULL DEFAULT 'midnight' CHECK (theme IN ('midnight', 'light', 'adaptive')),
  accent TEXT NOT NULL DEFAULT 'silver',
  music_uri TEXT NOT NULL DEFAULT '',
  music_mood TEXT NOT NULL DEFAULT 'Future Ambient',
  music_enabled BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  og_image TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_articles_status_published_idx
  ON public.blog_articles(status, published_at DESC);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published articles are public" ON public.blog_articles;
CREATE POLICY "Published articles are public" ON public.blog_articles
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can create articles" ON public.blog_articles;
CREATE POLICY "Authors can create articles" ON public.blog_articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update articles" ON public.blog_articles;
CREATE POLICY "Authors can update articles" ON public.blog_articles
  FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete articles" ON public.blog_articles;
CREATE POLICY "Authors can delete articles" ON public.blog_articles
  FOR DELETE USING (auth.uid() = author_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Blog media is public" ON storage.objects;
CREATE POLICY "Blog media is public" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-media');

DROP POLICY IF EXISTS "Authors can upload blog media" ON storage.objects;
CREATE POLICY "Authors can upload blog media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-media' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Authors can update blog media" ON storage.objects;
CREATE POLICY "Authors can update blog media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-media' AND owner_id = auth.uid()::text);

DROP POLICY IF EXISTS "Authors can delete blog media" ON storage.objects;
CREATE POLICY "Authors can delete blog media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-media' AND owner_id = auth.uid()::text);
