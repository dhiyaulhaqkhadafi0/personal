-- ============================================================
-- Migration Phase 1G: Real Reader Engagement (Views & Likes)
-- ============================================================
-- Tujuan:
--   1. Total engagement aggregate per artikel (view_count, like_count).
--   2. Log pembacaan harian terdeduplikasi (1x per visitor per hari kalender UTC).
--   3. Like aktif per pembaca anonim (maksimal 1 like aktif per visitor).
--   4. Trigger otomatis untuk konsistensi aggregate tanpa query count(*) berat.
--   5. Fungsi atomik untuk record view dan toggle like (service_role only).
--   6. RLS ketat: REVOKE dari anon & authenticated, GRANT hanya service_role.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Tabel Agregat Total Engagement per Artikel
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_engagement (
  article_id UUID PRIMARY KEY REFERENCES public.published_blog_articles(id) ON DELETE CASCADE,
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  like_count BIGINT NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2. Tabel Event Pembacaan Harian (Deduplikasi UTC)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_daily_views (
  id BIGSERIAL PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.published_blog_articles(id) ON DELETE CASCADE,
  visitor_hash VARCHAR(64) NOT NULL,
  viewed_on DATE NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'UTC'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_daily_views_uniq UNIQUE (article_id, visitor_hash, viewed_on)
);

CREATE INDEX IF NOT EXISTS idx_article_daily_views_lookup
  ON public.article_daily_views(article_id, viewed_on);

-- ------------------------------------------------------------
-- 3. Tabel Like Aktif per Pembaca Anonim
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_likes (
  id BIGSERIAL PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.published_blog_articles(id) ON DELETE CASCADE,
  visitor_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_likes_uniq UNIQUE (article_id, visitor_hash)
);

CREATE INDEX IF NOT EXISTS idx_article_likes_lookup
  ON public.article_likes(article_id, visitor_hash);

-- ------------------------------------------------------------
-- 4. Triggers untuk Pembaruan Agregat Otomatis & Atomik
-- ------------------------------------------------------------
-- Trigger ketika view harian baru berhasil dicatat
CREATE OR REPLACE FUNCTION public.sync_article_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.article_engagement (article_id, view_count, like_count, updated_at)
  VALUES (NEW.article_id, 1, 0, now())
  ON CONFLICT (article_id) DO UPDATE
  SET view_count = public.article_engagement.view_count + 1,
      updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_article_daily_views_insert ON public.article_daily_views;
CREATE TRIGGER trg_article_daily_views_insert
  AFTER INSERT ON public.article_daily_views
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_article_view_count();

-- Trigger ketika like baru ditambahkan
CREATE OR REPLACE FUNCTION public.sync_article_like_add()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.article_engagement (article_id, view_count, like_count, updated_at)
  VALUES (NEW.article_id, 0, 1, now())
  ON CONFLICT (article_id) DO UPDATE
  SET like_count = public.article_engagement.like_count + 1,
      updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_article_likes_insert ON public.article_likes;
CREATE TRIGGER trg_article_likes_insert
  AFTER INSERT ON public.article_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_article_like_add();

-- Trigger ketika like dibatalkan (unlike)
CREATE OR REPLACE FUNCTION public.sync_article_like_remove()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.article_engagement
  SET like_count = GREATEST(0, public.article_engagement.like_count - 1),
      updated_at = now()
  WHERE article_id = OLD.article_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_article_likes_delete ON public.article_likes;
CREATE TRIGGER trg_article_likes_delete
  AFTER DELETE ON public.article_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_article_like_remove();

-- ------------------------------------------------------------
-- 5. Helper RPC Atomik (Hanya dapat dipanggil service_role)
-- ------------------------------------------------------------
-- Catat view dengan deduplikasi kalender UTC
CREATE OR REPLACE FUNCTION public.record_article_view(p_slug text, p_visitor_hash text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_article_id uuid;
  v_inserted boolean := false;
  v_views bigint := 0;
  v_likes bigint := 0;
  v_has_liked boolean := false;
BEGIN
  -- 1. Validasi artikel harus sudah terbit di published_blog_articles
  SELECT id INTO v_article_id
  FROM public.published_blog_articles
  WHERE slug = p_slug;

  IF v_article_id IS NULL THEN
    RAISE EXCEPTION 'NOT_FOUND: Artikel tidak ditemukan dalam status terbit.'
      USING ERRCODE = '02000';
  END IF;

  -- 2. Insert deduplikasi view harian (UTC)
  BEGIN
    INSERT INTO public.article_daily_views (article_id, visitor_hash, viewed_on)
    VALUES (v_article_id, p_visitor_hash, (CURRENT_DATE AT TIME ZONE 'UTC'));
    v_inserted := true;
  EXCEPTION WHEN unique_violation THEN
    -- Sudah tercatat hari ini, abaikan tanpa error
    v_inserted := false;
  END;

  -- 3. Ambil nilai aggregate terbaru
  SELECT COALESCE(view_count, 0), COALESCE(like_count, 0)
  INTO v_views, v_likes
  FROM public.article_engagement
  WHERE article_id = v_article_id;

  -- 4. Cek apakah visitor ini sudah like
  SELECT EXISTS (
    SELECT 1 FROM public.article_likes
    WHERE article_id = v_article_id AND visitor_hash = p_visitor_hash
  ) INTO v_has_liked;

  RETURN jsonb_build_object(
    'ok', true,
    'recorded', v_inserted,
    'view_count', v_views,
    'like_count', v_likes,
    'viewer_has_liked', v_has_liked
  );
END;
$$;

-- Toggle like / unlike secara atomik
CREATE OR REPLACE FUNCTION public.toggle_article_like(p_slug text, p_visitor_hash text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_article_id uuid;
  v_has_liked boolean := false;
  v_views bigint := 0;
  v_likes bigint := 0;
BEGIN
  -- 1. Validasi artikel harus sudah terbit
  SELECT id INTO v_article_id
  FROM public.published_blog_articles
  WHERE slug = p_slug;

  IF v_article_id IS NULL THEN
    RAISE EXCEPTION 'NOT_FOUND: Artikel tidak ditemukan dalam status terbit.'
      USING ERRCODE = '02000';
  END IF;

  -- 2. Cek apakah saat ini sudah like
  SELECT EXISTS (
    SELECT 1 FROM public.article_likes
    WHERE article_id = v_article_id AND visitor_hash = p_visitor_hash
  ) INTO v_has_liked;

  IF v_has_liked THEN
    -- Unlike: hapus like
    DELETE FROM public.article_likes
    WHERE article_id = v_article_id AND visitor_hash = p_visitor_hash;
    v_has_liked := false;
  ELSE
    -- Like: tambahkan like
    INSERT INTO public.article_likes (article_id, visitor_hash)
    VALUES (v_article_id, p_visitor_hash)
    ON CONFLICT (article_id, visitor_hash) DO NOTHING;
    v_has_liked := true;
  END IF;

  -- 3. Ambil nilai aggregate terbaru
  SELECT COALESCE(view_count, 0), COALESCE(like_count, 0)
  INTO v_views, v_likes
  FROM public.article_engagement
  WHERE article_id = v_article_id;

  RETURN jsonb_build_object(
    'ok', true,
    'viewer_has_liked', v_has_liked,
    'like_count', v_likes,
    'view_count', v_views
  );
END;
$$;

-- Ambil statistik engagement & status like visitor
CREATE OR REPLACE FUNCTION public.get_article_engagement(p_slug text, p_visitor_hash text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_article_id uuid;
  v_views bigint := 0;
  v_likes bigint := 0;
  v_has_liked boolean := false;
BEGIN
  SELECT id INTO v_article_id
  FROM public.published_blog_articles
  WHERE slug = p_slug;

  IF v_article_id IS NULL THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'Not found'
    );
  END IF;

  SELECT COALESCE(view_count, 0), COALESCE(like_count, 0)
  INTO v_views, v_likes
  FROM public.article_engagement
  WHERE article_id = v_article_id;

  IF p_visitor_hash IS NOT NULL AND p_visitor_hash != '' THEN
    SELECT EXISTS (
      SELECT 1 FROM public.article_likes
      WHERE article_id = v_article_id AND visitor_hash = p_visitor_hash
    ) INTO v_has_liked;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'view_count', v_views,
    'like_count', v_likes,
    'viewer_has_liked', v_has_liked
  );
END;
$$;

-- ------------------------------------------------------------
-- 6. Row Level Security (RLS) & Hak Akses Ketat
-- ------------------------------------------------------------
ALTER TABLE public.article_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_daily_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Revoke seluruh akses dari anon dan authenticated
REVOKE ALL ON public.article_engagement FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.article_daily_views FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.article_likes FROM PUBLIC, anon, authenticated;

-- Grant hak akses tabel hanya ke service_role (server-side Next.js saja)
GRANT ALL ON public.article_engagement TO service_role;
GRANT ALL ON public.article_daily_views TO service_role;
GRANT ALL ON public.article_likes TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Revoke fungsi dari public dan batasi ke service_role
REVOKE ALL ON FUNCTION public.record_article_view(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.toggle_article_like(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_article_engagement(text, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_article_view(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.toggle_article_like(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_article_engagement(text, text) TO service_role;

COMMIT;
