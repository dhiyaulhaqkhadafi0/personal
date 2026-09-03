import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { resolveArticleCover, type PublishedArticle, type TiptapNode } from '@/lib/blog-types';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/blog');

export type BlogPostMetadata = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  slug: string;
  image?: string;
  cover_url?: string;
  cover_image?: string;
  cover_slides?: string[];
  readingTime?: number;
  musicMood?: string;
  musicEnabled?: boolean;
  theme?: string;
  musicUri?: string;
};

export type BlogPost = {
  metadata: BlogPostMetadata;
  content: string;
  contentHtml?: string;
  contentJson?: TiptapNode;
  source: 'mdx' | 'studio';
};

/**
 * Lightweight payload for blog listing and cards.
 * Excludes heavy content_json, content_html, and markdown bodies.
 */
export type BlogCardItem = {
  metadata: {
    title: string;
    slug: string;
    category: string;
    date: string;
    excerpt: string;
    image?: string;
    cover_url?: string;
    cover_slides?: string[];
    readingTime?: number;
  };
};

/**
 * Maps a full BlogPost to a lightweight BlogCardItem via explicit runtime object creation.
 */
export function toBlogCardItem(post: BlogPost): BlogCardItem {
  return {
    metadata: {
      title: post.metadata.title,
      slug: post.metadata.slug,
      category: post.metadata.category,
      date: post.metadata.date,
      excerpt: post.metadata.excerpt,
      image: post.metadata.image,
      cover_url: post.metadata.cover_url,
      cover_slides: post.metadata.cover_slides,
      readingTime: post.metadata.readingTime,
    },
  };
}

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
    const resolvedCover = resolveArticleCover({ ...(data as Record<string, unknown>), content });

    return {
      metadata: {
        ...data,
        slug: realSlug,
        image: resolvedCover || undefined,
      } as BlogPostMetadata,
      content,
      source: 'mdx',
    };
  } catch (error) {
    console.error(`Error reading post with slug: ${slug}`, error);
    return null;
  }
}

function publishedArticleToPost(article: PublishedArticle): BlogPost {
  const resolvedCover = resolveArticleCover(article);
  return {
    metadata: {
      title: article.title,
      category: article.category,
      date: article.published_at,
      excerpt: article.excerpt,
      slug: article.slug,
      image: resolvedCover || undefined,
      cover_url: article.cover_url,
      cover_slides: article.cover_slides,
      readingTime: article.reading_time,
      musicMood: article.music_mood,
      musicEnabled: article.music_enabled,
      theme: article.theme,
      musicUri: article.music_uri,
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
    .from('published_blog_articles')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) {
    console.error('Error reading published studio articles:', error.message);
    return [];
  }
  return (data as PublishedArticle[]).map(publishedArticleToPost);
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

/**
 * Returns lightweight listing card items for the /blog page.
 * Strips out content_json, content_html, and raw markdown bodies.
 */
export async function getBlogListingPosts(): Promise<BlogCardItem[]> {
  const allPosts = await getAllPosts();
  return allPosts.map(toBlogCardItem);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('published_blog_articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) return publishedArticleToPost(data as PublishedArticle);
    if (error) console.error(`Error reading published article ${slug}:`, error.message);
  }
  return getPostBySlug(slug);
}

/**
 * Deterministically fetches up to `limit` related published articles.
 * Excludes the current article. Prioritizes the same category first,
 * and fills remaining slots with newest published articles from other categories.
 */
export async function getRelatedPosts(currentSlug: string, category?: string, limit = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const candidates = allPosts.filter((post) => post.metadata.slug !== currentSlug);

  if (candidates.length === 0) return [];

  const sameCategory = category
    ? candidates.filter((post) => post.metadata.category?.toLowerCase() === category.toLowerCase())
    : [];

  const others = category
    ? candidates.filter((post) => post.metadata.category?.toLowerCase() !== category.toLowerCase())
    : candidates;

  return [...sameCategory, ...others].slice(0, limit);
}

