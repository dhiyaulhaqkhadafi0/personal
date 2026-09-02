-- ============================================================
-- Migration Fase 0b: published_blog_articles (Snapshot Table)
-- Jalankan di Supabase SQL Editor
-- ============================================================
-- Setelah sukses, verifikasi:
--   SELECT COUNT(*) FROM published_blog_articles; -- harus sama dengan jumlah artikel published
--   SELECT id, slug FROM published_blog_articles;
--   SELECT COUNT(*) FROM blog_articles WHERE status = 'published'; -- harus 0 atau lebih
-- ============================================================

BEGIN;

-- 1. Buat tabel snapshot publik
--    Tidak ada: author_id, created_at, published_snapshot, status
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

-- 2. RLS: published_blog_articles hanya bisa dibaca siapapun, ditulis hanya admin
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

-- 3. Perbarui RLS blog_articles: anon TIDAK BOLEH lagi membaca
--    Draft sekarang hanya dapat dibaca admin yang terautentikasi
DROP POLICY IF EXISTS "Published articles are public" ON public.blog_articles;

DROP POLICY IF EXISTS "Only admins can read articles" ON public.blog_articles;
CREATE POLICY "Only admins can read articles"
  ON public.blog_articles
  FOR SELECT USING (
    (SELECT private.is_blog_admin())
    AND (SELECT auth.uid()) = author_id
  );

-- 4. Backfill: migrasikan artikel published ke published_blog_articles
--    Menggunakan whitelist field eksplisit (bukan to_jsonb(*))
INSERT INTO public.published_blog_articles (
  id, slug, title, excerpt,
  content_json, content_html,
  category, cover_url, cover_slides,
  theme, accent,
  music_uri, music_mood, music_enabled,
  seo_title, seo_description, og_image,
  word_count, reading_time,
  published_at, updated_at
)
SELECT
  id, slug, title, excerpt,
  -- Gunakan snapshot jika ada (lebih aman), fallback ke kolom utama
  COALESCE(
    (published_snapshot->>'content_json')::jsonb,
    content_json
  ),
  COALESCE(published_snapshot->>'content_html', content_html),
  category, cover_url, cover_slides,
  theme, accent,
  music_uri, music_mood, music_enabled,
  seo_title, seo_description, og_image,
  word_count, reading_time,
  COALESCE(published_at, now()),
  now()
FROM public.blog_articles
WHERE status = 'published'
ON CONFLICT (id) DO NOTHING;

-- published_snapshot kolom dibiarkan untuk safety net
-- Untuk cleanup nanti (setelah verifikasi): 
-- ALTER TABLE public.blog_articles DROP COLUMN IF EXISTS published_snapshot;

COMMIT;
