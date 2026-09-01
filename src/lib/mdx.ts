import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { StudioArticle, TiptapNode } from '@/lib/blog-types';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/blog');

export type BlogPostMetadata = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  slug: string;
  image?: string;
  readingTime?: number;
  musicMood?: string;
  musicEnabled?: boolean;
};

export type BlogPost = {
  metadata: BlogPostMetadata;
  content: string;
  contentHtml?: string;
  contentJson?: TiptapNode;
  source: 'mdx' | 'studio';
};

export function getPostSlugs(): string[] {
  try {
    return fs.readdirSync(POSTS_DIRECTORY).filter((file) => file.endsWith('.mdx'));
  } catch (error) {
    console.error("Error reading posts directory", error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(POSTS_DIRECTORY, `${realSlug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      metadata: {
        ...data,
        slug: realSlug,
      } as BlogPostMetadata,
      content,
      source: 'mdx',
    };
  } catch (error) {
    console.error(`Error reading post with slug: ${slug}`, error);
    return null;
  }
}

function studioArticleToPost(article: StudioArticle): BlogPost {
  return {
    metadata: {
      title: article.title,
      category: article.category,
      date: article.published_at || article.updated_at,
      excerpt: article.excerpt,
      slug: article.slug,
      image: article.cover_url || undefined,
      readingTime: article.reading_time,
      musicMood: article.music_mood,
      musicEnabled: article.music_enabled,
    },
    content: '',
    contentHtml: article.content_html,
    contentJson: article.content_json,
    source: 'studio',
  };
}

async function getPublishedStudioPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) {
    console.error('Error reading published studio articles:', error.message);
    return [];
  }
  return (data as StudioArticle[]).map(studioArticleToPost);
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getPostSlugs();
  const mdxPosts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null);
  const studioPosts = await getPublishedStudioPosts();
  const studioSlugs = new Set(studioPosts.map((post) => post.metadata.slug));
  return [...studioPosts, ...mdxPosts.filter((post) => !studioSlugs.has(post.metadata.slug))]
    .sort((post1, post2) => new Date(post2.metadata.date).getTime() - new Date(post1.metadata.date).getTime());
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (!error && data) return studioArticleToPost(data as StudioArticle);
    if (error) console.error(`Error reading studio article ${slug}:`, error.message);
  }
  return getPostBySlug(slug);
}
