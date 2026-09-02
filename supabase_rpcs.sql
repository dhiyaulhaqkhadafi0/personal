-- ============================================================
-- Blog Studio RPC Functions (Fase 0c Hardening)
-- Jalankan SETELAH supabase_migration_fase0c_hardening.sql
-- ============================================================
-- Dua function atomic untuk publish dan unpublish artikel.
-- Keduanya menggunakan SECURITY INVOKER sehingga RLS tetap berlaku.
-- Admin divalidasi oleh private.is_blog_admin() + author_id check.
-- ============================================================

-- ------------------------------------------------------------
-- Function: publish_article
-- Melakukan snapshot upsert + update status dalam satu transaksi.
-- Tidak ada cara bagi snapshot untuk exist tanpa status = 'published',
-- atau sebaliknya — karena berada dalam satu BEGIN/COMMIT.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.publish_article(article_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_draft      public.blog_articles%ROWTYPE;
  v_now        TIMESTAMPTZ := now();
  v_snapshot   jsonb;
BEGIN
  -- 1. Verifikasi admin
  IF NOT (SELECT private.is_blog_admin()) THEN
    RAISE EXCEPTION 'UNAUTHORIZED: Hanya admin yang dapat mempublikasikan artikel.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Baca working draft — RLS akan memblokir jika bukan author
  SELECT * INTO v_draft
  FROM public.blog_articles
  WHERE id = article_id
    AND author_id = auth.uid()
  FOR UPDATE;  -- Lock row untuk mencegah race condition

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Artikel tidak ditemukan atau bukan milik Anda.'
      USING ERRCODE = '02000';
  END IF;

  -- 3. Build snapshot dengan whitelist field eksplisit
  --    Tidak ada: author_id, created_at, updated_at internal, published_snapshot
  v_snapshot := jsonb_build_object(
    'id',               v_draft.id,
    'slug',             v_draft.slug,
    'title',            v_draft.title,
    'excerpt',          v_draft.excerpt,
    'content_json',     v_draft.content_json,
    'content_html',     v_draft.content_html,
    'category',         v_draft.category,
    'cover_url',        v_draft.cover_url,
    'cover_slides',     v_draft.cover_slides,
    'theme',            v_draft.theme,
    'accent',           v_draft.accent,
    'music_uri',        v_draft.music_uri,
    'music_mood',       v_draft.music_mood,
    'music_enabled',    v_draft.music_enabled,
    'seo_title',        v_draft.seo_title,
    'seo_description',  v_draft.seo_description,
    'og_image',         v_draft.og_image,
    'word_count',       v_draft.word_count,
    'reading_time',     v_draft.reading_time,
    'published_at',     COALESCE(v_draft.published_at, v_now),
    'updated_at',       v_now
  );

  -- 4. Upsert ke published_blog_articles (dalam transaksi yang sama)
  INSERT INTO public.published_blog_articles (
    id, slug, title, excerpt, content_json, content_html,
    category, cover_url, cover_slides, theme, accent,
    music_uri, music_mood, music_enabled,
    seo_title, seo_description, og_image,
    word_count, reading_time, published_at, updated_at
  )
  VALUES (
    v_draft.id,
    v_draft.slug,
    v_draft.title,
    v_draft.excerpt,
    v_draft.content_json,
    v_draft.content_html,
    v_draft.category,
    v_draft.cover_url,
    v_draft.cover_slides,
    v_draft.theme,
    v_draft.accent,
    v_draft.music_uri,
    v_draft.music_mood,
    v_draft.music_enabled,
    v_draft.seo_title,
    v_draft.seo_description,
    v_draft.og_image,
    v_draft.word_count,
    v_draft.reading_time,
    COALESCE(v_draft.published_at, v_now),
    v_now
  )
  ON CONFLICT (id) DO UPDATE SET
    slug             = EXCLUDED.slug,
    title            = EXCLUDED.title,
    excerpt          = EXCLUDED.excerpt,
    content_json     = EXCLUDED.content_json,
    content_html     = EXCLUDED.content_html,
    category         = EXCLUDED.category,
    cover_url        = EXCLUDED.cover_url,
    cover_slides     = EXCLUDED.cover_slides,
    theme            = EXCLUDED.theme,
    accent           = EXCLUDED.accent,
    music_uri        = EXCLUDED.music_uri,
    music_mood       = EXCLUDED.music_mood,
    music_enabled    = EXCLUDED.music_enabled,
    seo_title        = EXCLUDED.seo_title,
    seo_description  = EXCLUDED.seo_description,
    og_image         = EXCLUDED.og_image,
    word_count       = EXCLUDED.word_count,
    reading_time     = EXCLUDED.reading_time,
    updated_at       = EXCLUDED.updated_at;
    -- published_at hanya diset pertama kali (tidak diupdate saat "Perbarui")

  -- 5. Update status draft (dalam transaksi yang sama)
  UPDATE public.blog_articles
  SET
    status       = 'published',
    published_at = COALESCE(published_at, v_now),
    updated_at   = v_now
  WHERE id = article_id
    AND author_id = auth.uid();

  RETURN jsonb_build_object(
    'ok',       true,
    'id',       article_id,
    'slug',     v_draft.slug,
    'snapshot', v_snapshot
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'CONFLICT: Slug sudah digunakan artikel lain.'
      USING ERRCODE = '23505';
END;
$$;

-- ------------------------------------------------------------
-- Function: unpublish_article
-- Menghapus snapshot publik + revert status dalam satu transaksi.
-- Jika salah satu gagal, seluruh operasi di-rollback.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unpublish_article(article_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_now  TIMESTAMPTZ := now();
  v_slug TEXT;
BEGIN
  -- 1. Verifikasi admin
  IF NOT (SELECT private.is_blog_admin()) THEN
    RAISE EXCEPTION 'UNAUTHORIZED: Hanya admin yang dapat unpublish artikel.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Ambil slug untuk return value, validasi kepemilikan
  SELECT slug INTO v_slug
  FROM public.blog_articles
  WHERE id = article_id
    AND author_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: Artikel tidak ditemukan atau bukan milik Anda.'
      USING ERRCODE = '02000';
  END IF;

  -- 3. Hapus snapshot publik (dalam transaksi yang sama)
  DELETE FROM public.published_blog_articles WHERE id = article_id;

  -- 4. Revert status ke draft (dalam transaksi yang sama)
  UPDATE public.blog_articles
  SET
    status     = 'draft',
    updated_at = v_now
  WHERE id = article_id
    AND author_id = auth.uid();

  RETURN jsonb_build_object(
    'ok',   true,
    'id',   article_id,
    'slug', v_slug
  );
END;
$$;

-- ------------------------------------------------------------
-- Permissions: hanya authenticated yang bisa memanggil RPC
-- Anon tidak punya akses sama sekali
-- ------------------------------------------------------------
REVOKE ALL ON FUNCTION public.publish_article(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.unpublish_article(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_article(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unpublish_article(uuid) TO authenticated;
