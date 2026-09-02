-- ============================================================
-- Blog Studio RPC Functions
-- ============================================================
-- 1. publish_article(article_id uuid) -> jsonb
-- 2. unpublish_article(article_id uuid) -> jsonb
-- 3. increment_blog_metric(p_slug text, p_type text) -> jsonb
-- ============================================================

-- ------------------------------------------------------------
-- Function: publish_article
-- Melakukan snapshot upsert + update status dalam satu transaksi.
-- Mengatur published_at (first publish) dan last_published_at (every publish).
-- Mengembalikan row artikel terbaru.
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

  -- 5. Update status & timestamps draft (dalam transaksi yang sama)
  UPDATE public.blog_articles
  SET
    status            = 'published',
    published_at      = COALESCE(published_at, v_now),
    last_published_at = v_now,
    updated_at        = v_now
  WHERE id = article_id
    AND author_id = auth.uid()
  RETURNING * INTO v_draft;

  RETURN jsonb_build_object(
    'ok',                true,
    'id',                article_id,
    'slug',              v_draft.slug,
    'published_at',      v_draft.published_at,
    'last_published_at', v_draft.last_published_at,
    'updated_at',        v_draft.updated_at,
    'article',           row_to_json(v_draft),
    'snapshot',          v_snapshot
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
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unpublish_article(article_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_draft public.blog_articles%ROWTYPE;
  v_now   TIMESTAMPTZ := now();
  v_slug  TEXT;
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
    AND author_id = auth.uid()
  RETURNING * INTO v_draft;

  RETURN jsonb_build_object(
    'ok',      true,
    'id',      article_id,
    'slug',    v_slug,
    'article', row_to_json(v_draft)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.publish_article(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.unpublish_article(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_article(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unpublish_article(uuid) TO authenticated;

-- ------------------------------------------------------------
-- Function: increment_blog_metric (Atomic write for metrics)
-- Hanya bisa dipanggil oleh service_role (backend Next.js)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_blog_metric(p_slug text, p_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_exists boolean;
  v_views integer;
  v_ignites integer;
BEGIN
  -- 1. Validasi type
  IF p_type NOT IN ('view', 'ignite') THEN
    RAISE EXCEPTION 'INVALID_TYPE: Tipe metric harus "view" atau "ignite".'
      USING ERRCODE = '22023';
  END IF;

  -- 2. Validasi slug benar-benar ada di published_blog_articles
  SELECT EXISTS (
    SELECT 1 FROM public.published_blog_articles WHERE slug = p_slug
  ) INTO v_exists;

  IF NOT v_exists THEN
    RAISE EXCEPTION 'NOT_FOUND: Artikel dengan slug % tidak ditemukan dalam artikel terbit.', p_slug
      USING ERRCODE = '02000';
  END IF;

  -- 3. Atomic increment via INSERT ... ON CONFLICT DO UPDATE
  IF p_type = 'view' THEN
    INSERT INTO public.blog_metrics (slug, view_count, ignite_count)
    VALUES (p_slug, 1, 0)
    ON CONFLICT (slug) DO UPDATE
    SET view_count = public.blog_metrics.view_count + 1
    RETURNING view_count, ignite_count INTO v_views, v_ignites;
  ELSE
    INSERT INTO public.blog_metrics (slug, view_count, ignite_count)
    VALUES (p_slug, 0, 1)
    ON CONFLICT (slug) DO UPDATE
    SET ignite_count = public.blog_metrics.ignite_count + 1
    RETURNING view_count, ignite_count INTO v_views, v_ignites;
  END IF;

  RETURN jsonb_build_object(
    'view_count', v_views,
    'ignite_count', v_ignites
  );
END;
$$;

REVOKE ALL ON FUNCTION public.increment_blog_metric(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_blog_metric(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.increment_blog_metric(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_blog_metric(text, text) TO service_role;
