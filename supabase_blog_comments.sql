-- Run this SQL in your Supabase SQL Editor to create the blog_comments table

CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Optional: Add an index on slug for faster querying
CREATE INDEX IF NOT EXISTS idx_blog_comments_slug ON public.blog_comments(slug);

-- Enable RLS if you want to restrict access (Optional)
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Allow anonymous read" ON public.blog_comments
    FOR SELECT USING (true);

-- Allow anyone to insert comments (since we don't have auth yet)
CREATE POLICY "Allow anonymous insert" ON public.blog_comments
    FOR INSERT WITH CHECK (true);
