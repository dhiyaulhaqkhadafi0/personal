-- Migration Fase 0: Add published_snapshot to blog_articles
-- Run this in Supabase SQL Editor

ALTER TABLE public.blog_articles 
ADD COLUMN IF NOT EXISTS published_snapshot JSONB DEFAULT NULL;

-- Migrate existing published articles:
-- Wrap the row in JSON and store it in published_snapshot
UPDATE public.blog_articles
SET published_snapshot = to_jsonb(blog_articles.*)
WHERE status = 'published' AND published_snapshot IS NULL;
