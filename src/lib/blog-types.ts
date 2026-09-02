export type ArticleStatus = 'draft' | 'published';

export type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  text?: string;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

export type StudioArticle = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_json: TiptapNode;
  content_html: string;
  status: ArticleStatus;
  category: string;
  cover_url: string;
  cover_slides: string[];
  theme: 'midnight' | 'light' | 'adaptive';
  accent: string;
  music_uri: string;
  music_mood: string;
  music_enabled: boolean;
  seo_title: string;
  seo_description: string;
  og_image: string;
  word_count: number;
  reading_time: number;
  published_at: string | null;
  last_published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Shape of a row in published_blog_articles — no internal fields. */
export type PublishedArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_json: TiptapNode;
  content_html: string;
  category: string;
  cover_url: string;
  cover_slides: string[];
  theme: 'midnight' | 'light' | 'adaptive';
  accent: string;
  music_uri: string;
  music_mood: string;
  music_enabled: boolean;
  seo_title: string;
  seo_description: string;
  og_image: string;
  word_count: number;
  reading_time: number;
  published_at: string;
  updated_at: string;
};

/**
 * Serializes a StudioArticle into a clean PublishedArticle.
 * Explicit whitelist — no author_id, timestamps, or internal fields.
 */
export function buildPublicSnapshot(article: StudioArticle, now: string): PublishedArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content_json: article.content_json,
    content_html: article.content_html,
    category: article.category,
    cover_url: article.cover_url,
    cover_slides: article.cover_slides,
    theme: article.theme,
    accent: article.accent,
    music_uri: article.music_uri,
    music_mood: article.music_mood,
    music_enabled: article.music_enabled,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    og_image: article.og_image,
    word_count: article.word_count,
    reading_time: article.reading_time,
    published_at: article.published_at ?? now,
    updated_at: now,
  };
}

export const emptyTiptapDocument: TiptapNode = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

/**
 * Normalizes and resolves the valid cover image for an article based on standard priority:
 * 1. cover_image (explicit single cover field)
 * 2. cover_url (Studio / PublishedArticle canonical field)
 * 3. image (MDX frontmatter field)
 * 4. cover_slides (first valid image URL from array or JSON string)
 * Returns null if all are empty/invalid, allowing the caller to render a premium fallback.
 */
export function resolveArticleCover(source?: {
  cover_image?: string | null;
  cover_url?: string | null;
  image?: string | null;
  cover_slides?: string[] | unknown;
} | null): string | null {
  if (!source) return null;

  if (typeof source.cover_image === 'string' && source.cover_image.trim()) {
    return source.cover_image.trim();
  }

  if (typeof source.cover_url === 'string' && source.cover_url.trim()) {
    return source.cover_url.trim();
  }

  if (typeof source.image === 'string' && source.image.trim()) {
    return source.image.trim();
  }

  if (Array.isArray(source.cover_slides) && source.cover_slides.length > 0) {
    for (const slide of source.cover_slides) {
      if (typeof slide === 'string' && slide.trim()) {
        return slide.trim();
      }
    }
  } else if (typeof source.cover_slides === 'string' && source.cover_slides.trim()) {
    try {
      const parsed = JSON.parse(source.cover_slides);
      if (Array.isArray(parsed) && parsed.length > 0) {
        for (const slide of parsed) {
          if (typeof slide === 'string' && slide.trim()) {
            return slide.trim();
          }
        }
      }
    } catch {
      if (source.cover_slides.startsWith('http') || source.cover_slides.startsWith('/')) {
        return source.cover_slides.trim();
      }
    }
  }

  return null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}

export function tiptapHeadingsToMarkdown(document: TiptapNode) {
  const lines: string[] = [];
  const visit = (node: TiptapNode) => {
    if (node.type === 'heading') {
      const level = Number(node.attrs?.level || 2);
      const text = (node.content || []).map((child) => child.text || '').join('');
      if (text && (level === 2 || level === 3)) lines.push(`${'#'.repeat(level)} ${text}`);
    }
    node.content?.forEach(visit);
  };
  visit(document);
  return lines.join('\n');
}

function headingId(value: string) {
  return value.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, '-')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function addHeadingIds(html: string) {
  return html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (_match, tag: string, attrs: string, body: string) => {
    if (/\sid=/.test(attrs)) return `<${tag}${attrs}>${body}</${tag}>`;
    return `<${tag}${attrs} id="${headingId(body)}">${body}</${tag}>`;
  });
}
