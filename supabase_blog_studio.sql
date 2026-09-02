-- Khadafi Blog Studio: articles, RLS, and public media bucket.
-- Run this once in the Supabase SQL Editor before opening /studio.

-- The allowlist is intentionally empty in source control. Add the owner email
-- privately after this migration has been applied.
CREATE TABLE IF NOT EXISTS public.blog_admin_emails (
  email TEXT PRIMARY KEY CHECK (email = lower(email)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_admin_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access to blog admins" ON public.blog_admin_emails;
CREATE POLICY "No direct access to blog admins" ON public.blog_admin_emails
  FOR ALL USING (false) WITH CHECK (false);

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;

CREATE OR REPLACE FUNCTION private.is_blog_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.blog_admin_emails
    WHERE email = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION private.is_blog_admin() FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_blog_admin() TO anon, authenticated;

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
  published_snapshot JSONB DEFAULT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_articles_status_published_idx
  ON public.blog_articles(status, published_at DESC);

CREATE INDEX IF NOT EXISTS blog_articles_author_id_idx
  ON public.blog_articles(author_id);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.blog_articles FROM anon, authenticated;
GRANT SELECT ON public.blog_articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_articles TO authenticated;

-- IMPORTANT: anon cannot read blog_articles — only admin can.
-- Public content is served from published_blog_articles (see below).
DROP POLICY IF EXISTS "Published articles are public" ON public.blog_articles;
DROP POLICY IF EXISTS "Only admins can read articles" ON public.blog_articles;
CREATE POLICY "Only admins can read articles" ON public.blog_articles
  FOR SELECT USING (
    (SELECT private.is_blog_admin())
    AND (SELECT auth.uid()) = author_id
  );

DROP POLICY IF EXISTS "Authors can create articles" ON public.blog_articles;
CREATE POLICY "Authors can create articles" ON public.blog_articles
  FOR INSERT WITH CHECK (
    (SELECT private.is_blog_admin())
    AND (SELECT auth.uid()) = author_id
  );

DROP POLICY IF EXISTS "Authors can update articles" ON public.blog_articles;
CREATE POLICY "Authors can update articles" ON public.blog_articles
  FOR UPDATE
  USING (
    (SELECT private.is_blog_admin())
    AND (SELECT auth.uid()) = author_id
  )
  WITH CHECK (
    (SELECT private.is_blog_admin())
    AND (SELECT auth.uid()) = author_id
  );

DROP POLICY IF EXISTS "Authors can delete articles" ON public.blog_articles;
CREATE POLICY "Authors can delete articles" ON public.blog_articles
  FOR DELETE USING (
    (SELECT private.is_blog_admin())
    AND (SELECT auth.uid()) = author_id
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Blog media is public" ON storage.objects;
CREATE POLICY "Blog media is public" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-media');

DROP POLICY IF EXISTS "Authors can upload blog media" ON storage.objects;
CREATE POLICY "Authors can upload blog media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.is_blog_admin())
    AND bucket_id = 'blog-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Authors can update blog media" ON storage.objects;
CREATE POLICY "Authors can update blog media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    (SELECT private.is_blog_admin())
    AND bucket_id = 'blog-media'
    AND owner_id = (SELECT auth.uid())::text
  )
  WITH CHECK (
    (SELECT private.is_blog_admin())
    AND bucket_id = 'blog-media'
    AND owner_id = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Authors can delete blog media" ON storage.objects;
CREATE POLICY "Authors can delete blog media" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    (SELECT private.is_blog_admin())
    AND bucket_id = 'blog-media'
    AND owner_id = (SELECT auth.uid())::text
  );

-- ============================================================
-- Public snapshot table (added in Migration Fase 0b)
-- This is the ONLY table anon can read.
-- blog_articles is write-only from the perspective of anon.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.published_blog_articles (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_html TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Ideas',
  cover_url TEXT NOT NULL DEFAULT '',
  cover_slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme TEXT NOT NULL DEFAULT 'midnight',
  accent TEXT NOT NULL DEFAULT 'silver',
  music_uri TEXT NOT NULL DEFAULT '',
  music_mood TEXT NOT NULL DEFAULT 'Future Ambient',
  music_enabled BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  og_image TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS published_blog_articles_slug_idx
  ON public.published_blog_articles(slug);

CREATE INDEX IF NOT EXISTS published_blog_articles_published_at_idx
  ON public.published_blog_articles(published_at DESC);

ALTER TABLE public.published_blog_articles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.published_blog_articles FROM anon, authenticated;
GRANT SELECT ON public.published_blog_articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.published_blog_articles TO authenticated;

DROP POLICY IF EXISTS "Published snapshots are publicly readable" ON public.published_blog_articles;
CREATE POLICY "Published snapshots are publicly readable"
  ON public.published_blog_articles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can write snapshots" ON public.published_blog_articles;
CREATE POLICY "Only admins can write snapshots"
  ON public.published_blog_articles
  FOR ALL
  USING ((SELECT private.is_blog_admin()))
  WITH CHECK ((SELECT private.is_blog_admin()));
