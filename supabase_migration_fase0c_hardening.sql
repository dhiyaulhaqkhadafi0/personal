-- ============================================================
-- Migration Fase 0c: Security Hardening
-- Jalankan di Supabase SQL Editor
-- ============================================================
-- Mencakup:
--   1. FK published_blog_articles.id -> blog_articles(id) ON DELETE CASCADE
--   2. Drop redundant slug index (UNIQUE constraint sudah buat index)
--   3. Split FOR ALL policy menjadi INSERT / UPDATE / DELETE terpisah
--   4. REVOKE SELECT FROM anon on blog_articles (defense-in-depth)
--   5. blog_metrics: public SELECT policy + server-only write policy
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Foreign Key: published_blog_articles -> blog_articles
--    ON DELETE CASCADE: hapus draft = hapus snapshot otomatis
--    Aman karena backfill sudah memastikan semua id ada di blog_articles
-- ------------------------------------------------------------
ALTER TABLE public.published_blog_articles
  ADD CONSTRAINT published_blog_articles_id_fkey
  FOREIGN KEY (id)
  REFERENCES public.blog_articles(id)
  ON DELETE CASCADE;

-- ------------------------------------------------------------
-- 2. Drop redundant index
--    UNIQUE constraint pada slug sudah membuat unique index.
--    Index terpisah hanya membuang storage.
--    published_at index tetap dipertahankan.
-- ------------------------------------------------------------
DROP INDEX IF EXISTS public.published_blog_articles_slug_idx;

-- ------------------------------------------------------------
-- 3. Split policy FOR ALL menjadi granular per operation
--    Mengganti "Only admins can write snapshots" yang terlalu broad
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Only admins can write snapshots" ON public.published_blog_articles;

CREATE POLICY "Admins can insert snapshots"
  ON public.published_blog_articles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_blog_admin()));

CREATE POLICY "Admins can update snapshots"
  ON public.published_blog_articles
  FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_blog_admin()))
  WITH CHECK ((SELECT private.is_blog_admin()));

CREATE POLICY "Admins can delete snapshots"
  ON public.published_blog_articles
  FOR DELETE
  TO authenticated
  USING ((SELECT private.is_blog_admin()));

-- SELECT policy tidak berubah: "Published snapshots are publicly readable" (USING true)

-- ------------------------------------------------------------
-- 4. Defense-in-depth: REVOKE SELECT FROM anon on blog_articles
--    RLS policy sudah memblokir anon, ini tambahan hardening.
--    Admin authenticated tetap bisa SELECT via policy RLS.
--    Verifikasi setelah: Studio harus masih bisa load artikel.
-- ------------------------------------------------------------
REVOKE SELECT ON public.blog_articles FROM anon;

-- ------------------------------------------------------------
-- 5. blog_metrics: policies agar API bisa berfungsi
--
--    GET /api/metrics/[slug] menggunakan anon key → butuh SELECT policy
--    POST /api/metrics/[slug] akan direfactor ke service_role → tidak butuh write policy public
--
--    Catatan: rls_auto_enable() adalah fungsi internal Supabase system
--    yang dibuat otomatis oleh migrations engine. Jangan dimodifikasi.
-- ------------------------------------------------------------
ALTER TABLE public.blog_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Metrics are publicly readable" ON public.blog_metrics;
CREATE POLICY "Metrics are publicly readable"
  ON public.blog_metrics
  FOR SELECT
  USING (true);

-- Write (INSERT/UPDATE) akan dilakukan via service_role key di Next.js server
-- service_role key bypass RLS, jadi tidak butuh policy untuk write
-- Policy write sengaja tidak dibuat untuk anon/authenticated agar tidak bisa
-- dimanipulasi langsung dari client atau request eksternal

COMMIT;

-- ============================================================
-- Verifikasi setelah menjalankan:
--
-- 1. Pastikan FK ada:
--    SELECT conname FROM pg_constraint
--    WHERE conrelid = 'published_blog_articles'::regclass
--    AND contype = 'f';
--
-- 2. Pastikan index duplikat sudah hilang:
--    SELECT indexname FROM pg_indexes
--    WHERE tablename = 'published_blog_articles';
--    Harus ada: published_blog_articles_pkey, 
--               published_blog_articles_slug_key (dari UNIQUE constraint),
--               published_blog_articles_published_at_idx
--    TIDAK ada: published_blog_articles_slug_idx (ini yang kita drop)
--
-- 3. Test anon tidak bisa baca blog_articles (harus 0 rows atau 403)
-- 4. Test anon bisa baca published_blog_articles
-- 5. Test delete blog_articles cascade ke published_blog_articles
-- ============================================================
