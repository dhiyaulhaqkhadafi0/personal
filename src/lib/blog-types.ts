export type ArticleStatus = 'draft' | 'published';

export type FocalPoint = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type HeroLayout = 'editorial' | 'immersive' | 'cinematic';

export type VisualSettings = {
  focal_point: FocalPoint;
  caption: string;
  credit: string;
  alt_text: string;
  hero_layout: HeroLayout;
};

export const defaultVisualSettings: VisualSettings = {
  focal_point: 'center',
  caption: '',
  credit: '',
  alt_text: '',
  hero_layout: 'editorial',
};

export const FOCAL_POINT_CSS: Record<FocalPoint, string> = {
  center: '50% 50%',
  top: '50% 0%',
  bottom: '50% 100%',
  left: '0% 50%',
  right: '100% 50%',
};

export const FOCAL_POINT_LABELS: Record<FocalPoint, string> = {
  center: 'Tengah',
  top: 'Atas',
  bottom: 'Bawah',
  left: 'Kiri',
  right: 'Kanan',
};

export type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  text?: string;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  visual_settings?: VisualSettings;
  distribution_settings?: DistributionSettings;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
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
 * Recursively extracts the first valid image URL from a Tiptap document tree.
 * Defensively inspects nodes of type 'image', 'studioImage', 'figure', or any node with an image src attribute.
 */
export function extractFirstImageFromTiptap(node?: unknown): string | null {
  if (!node || typeof node !== 'object') return null;

  const n = node as Record<string, unknown>;

  // Check if this node is an image node
  if (n.type === 'image' || n.type === 'studioImage' || n.type === 'figure' || n.type === 'img') {
    if (n.attrs && typeof n.attrs === 'object') {
      const attrs = n.attrs as Record<string, unknown>;
      const src = attrs.src || attrs.url || attrs.href;
      if (typeof src === 'string' && src.trim().length > 0) {
        return src.trim();
      }
    }
  }

  if (n.attrs && typeof n.attrs === 'object') {
    const attrs = n.attrs as Record<string, unknown>;
    if (typeof attrs.src === 'string' && (attrs.src.startsWith('http') || attrs.src.startsWith('/'))) {
      return attrs.src.trim();
    }
  }

  // Recurse into children
  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      const found = extractFirstImageFromTiptap(child);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Extracts the first image URL from raw markdown or HTML content.
 */
export function extractFirstImageFromMarkdown(content?: string | null): string | null {
  if (!content || typeof content !== 'string') return null;

  // 1. Markdown syntax: ![alt](url)
  const mdMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1] && mdMatch[1].trim()) {
    return mdMatch[1].trim();
  }

  // 2. HTML img syntax: <img ... src="url" ... />
  const htmlMatch = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+|\/[^"']+)["']/i);
  if (htmlMatch && htmlMatch[1] && htmlMatch[1].trim()) {
    return htmlMatch[1].trim();
  }

  return null;
}

export type ArticleCoverSource = {
  cover_image?: string | null;
  cover_url?: string | null;
  image?: string | null;
  cover_slides?: string[] | unknown;
  content_json?: TiptapNode | unknown;
  content?: string | null;
  content_html?: string | null;
};

/**
 * Checks whether an article's resolved cover is automatically derived from its body images.
 */
export function isAutoExtractedCover(source?: ArticleCoverSource | null): boolean {
  if (!source) return false;
  if (typeof source.cover_image === 'string' && source.cover_image.trim()) return false;
  if (typeof source.cover_url === 'string' && source.cover_url.trim()) return false;
  if (typeof source.image === 'string' && source.image.trim()) return false;
  if (Array.isArray(source.cover_slides) && source.cover_slides.some((s) => typeof s === 'string' && s.trim())) return false;

  const autoImg = extractFirstImageFromTiptap(source.content_json) ||
    extractFirstImageFromMarkdown(source.content) ||
    extractFirstImageFromMarkdown(source.content_html);

  return Boolean(autoImg);
}

/**
 * Normalizes and resolves the valid cover image for an article based on standard priority:
 * 1. cover_image (explicit single cover field)
 * 2. cover_url (Studio / PublishedArticle canonical field)
 * 3. image (MDX frontmatter field)
 * 4. cover_slides (first valid image URL from array or JSON string)
 * 5. first image in article body (content_json Tiptap tree or markdown/HTML content)
 * 6. null (caller renders typographic fallback with article title and category)
 */
export function resolveArticleCover(source?: ArticleCoverSource | null): string | null {
  if (!source) return null;

  // 1. cover_image
  if (typeof source.cover_image === 'string' && source.cover_image.trim()) {
    return source.cover_image.trim();
  }

  // 2. cover_url
  if (typeof source.cover_url === 'string' && source.cover_url.trim()) {
    return source.cover_url.trim();
  }

  // 3. image
  if (typeof source.image === 'string' && source.image.trim()) {
    return source.image.trim();
  }

  // 4. cover_slides
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

  // 5. First image in article body
  if (source.content_json) {
    const tiptapImg = extractFirstImageFromTiptap(source.content_json);
    if (tiptapImg) return tiptapImg;
  }

  if (source.content) {
    const mdImg = extractFirstImageFromMarkdown(source.content);
    if (mdImg) return mdImg;
  }

  if (source.content_html) {
    const htmlImg = extractFirstImageFromMarkdown(source.content_html);
    if (htmlImg) return htmlImg;
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

export function formatCreditDisplay(credit?: string | null): string {
  if (!credit) return '';
  const trimmed = credit.replace(/<[^>]*>/g, '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      return url.hostname.replace(/^www\./i, '');
    } catch {
      return '';
    }
  }
  return trimmed;
}

export function extractVisualSettings(source?: unknown): VisualSettings {
  if (!source || typeof source !== 'object') {
    return { ...defaultVisualSettings };
  }

  const obj = source as Record<string, unknown>;

  let raw: unknown = obj.visual_settings;

  if (!raw && obj.content_json && typeof obj.content_json === 'object') {
    const cj = obj.content_json as Record<string, unknown>;
    raw =
      cj.visual_settings ||
      (cj.meta && typeof cj.meta === 'object' ? (cj.meta as Record<string, unknown>).visual_settings : undefined) ||
      (cj.attrs && typeof cj.attrs === 'object' ? (cj.attrs as Record<string, unknown>).visual_settings : undefined);
  }

  if (!raw && obj.meta && typeof obj.meta === 'object') {
    raw = (obj.meta as Record<string, unknown>).visual_settings;
  }
  if (!raw && obj.attrs && typeof obj.attrs === 'object') {
    raw = (obj.attrs as Record<string, unknown>).visual_settings;
  }

  if (!raw || typeof raw !== 'object') {
    return { ...defaultVisualSettings };
  }

  const r = raw as Record<string, unknown>;

  const focal: FocalPoint =
    r.focal_point === 'top' || r.focal_point === 'bottom' || r.focal_point === 'left' || r.focal_point === 'right'
      ? r.focal_point
      : 'center';

  const layout: HeroLayout =
    r.hero_layout === 'immersive' || r.hero_layout === 'cinematic'
      ? r.hero_layout
      : 'editorial';

  const cleanString = (val: unknown, maxLen: number) => {
    if (typeof val !== 'string') return '';
    return val.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
  };

  return {
    focal_point: focal,
    caption: cleanString(r.caption, 160),
    credit: cleanString(r.credit, 80),
    alt_text: cleanString(r.alt_text, 160),
    hero_layout: layout,
  };
}

export function applyVisualSettingsToContentJson(
  contentJson: unknown,
  settings: Partial<VisualSettings>,
): TiptapNode {
  const base: Record<string, unknown> =
    contentJson && typeof contentJson === 'object'
      ? { ...(contentJson as Record<string, unknown>) }
      : { type: 'doc', content: [{ type: 'paragraph' }] };

  const currentSettings = extractVisualSettings(base);
  const nextSettings: VisualSettings = {
    ...currentSettings,
    ...settings,
  };

  const meta = base.meta && typeof base.meta === 'object' ? { ...(base.meta as Record<string, unknown>) } : {};
  meta.visual_settings = nextSettings;

  const attrs = base.attrs && typeof base.attrs === 'object' ? { ...(base.attrs as Record<string, unknown>) } : {};
  attrs.visual_settings = nextSettings;

  return {
    ...base,
    visual_settings: nextSettings,
    meta,
    attrs,
  } as TiptapNode;
}

export type DistributionSettings = {
  cta_enabled: boolean;
  cta_title: string;
  cta_description: string;
  cta_button_label: string;
  cta_button_url: string;
};

export const defaultDistributionSettings: DistributionSettings = {
  cta_enabled: false,
  cta_title: '',
  cta_description: '',
  cta_button_label: '',
  cta_button_url: '',
};

export const CTA_PRESETS = [
  {
    id: 'digital-product',
    label: 'Lihat Produk Digital',
    title: 'Eksplorasi Blueprint & Produk Digital',
    description: 'Dapatkan arsitektur sistem, panduan teknis, dan blueprint yang telah diuji langsung dalam produksi.',
    button_label: 'Lihat Produk Digital',
    button_url: '/produk',
  },
  {
    id: 'services',
    label: 'Jelajahi Jasa Saya',
    title: 'Bangun Solusi AI & Rekayasa Produk Bersama Saya',
    description: 'Konsultasi arsitektur sistem, engineering modern, atau pengembangan produk digital dari nol hingga skala penuh.',
    button_label: 'Jelajahi Jasa',
    button_url: '/services',
  },
  {
    id: 'follow-journey',
    label: 'Ikuti Perjalanan Saya',
    title: 'Mari Terhubung dan Berdiskusi Lebih Jauh',
    description: 'Ikuti catatan teknis, insight arsitektur AI, dan eksplorasi rekayasa perangkat lunak saya di media sosial.',
    button_label: 'Ikuti Perjalanan',
    button_url: 'https://linkedin.com',
  },
  {
    id: 'main-link',
    label: 'Kunjungi Link Utama',
    title: 'Kenali Lebih Dekat Portofolio & Manifesto Saya',
    description: 'Pelajari filosofi engineering, latar belakang teknis, dan studi kasus proyek yang telah saya kembangkan.',
    button_label: 'Kunjungi Profil Utama',
    button_url: '/about',
  },
] as const;

export function isValidCtaUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Disallow unsafe schemes (javascript:, data:, vbscript:, file:, etc.)
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return false;
  // Allow safe internal paths like /produk, /about, /services
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  // Allow safe https:// URLs
  if (/^https:\/\//i.test(trimmed)) return true;
  return false;
}

export function isCtaCompleteAndEnabled(settings?: DistributionSettings | null): boolean {
  if (!settings || !settings.cta_enabled) return false;
  if (!settings.cta_title.trim()) return false;
  if (!settings.cta_button_label.trim()) return false;
  if (!isValidCtaUrl(settings.cta_button_url)) return false;
  return true;
}

export function extractDistributionSettings(source?: unknown): DistributionSettings {
  if (!source || typeof source !== 'object') {
    return { ...defaultDistributionSettings };
  }

  const obj = source as Record<string, unknown>;

  let raw: unknown = obj.distribution_settings;

  if (!raw && obj.content_json && typeof obj.content_json === 'object') {
    const cj = obj.content_json as Record<string, unknown>;
    raw =
      cj.distribution_settings ||
      (cj.meta && typeof cj.meta === 'object' ? (cj.meta as Record<string, unknown>).distribution_settings : undefined) ||
      (cj.attrs && typeof cj.attrs === 'object' ? (cj.attrs as Record<string, unknown>).distribution_settings : undefined);
  }

  if (!raw && obj.meta && typeof obj.meta === 'object') {
    raw = (obj.meta as Record<string, unknown>).distribution_settings;
  }
  if (!raw && obj.attrs && typeof obj.attrs === 'object') {
    raw = (obj.attrs as Record<string, unknown>).distribution_settings;
  }

  if (!raw || typeof raw !== 'object') {
    return { ...defaultDistributionSettings };
  }

  const r = raw as Record<string, unknown>;

  const cleanString = (val: unknown, maxLen: number) => {
    if (typeof val !== 'string') return '';
    return val.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
  };

  return {
    cta_enabled: Boolean(r.cta_enabled),
    cta_title: cleanString(r.cta_title, 80),
    cta_description: cleanString(r.cta_description, 180),
    cta_button_label: cleanString(r.cta_button_label, 40),
    cta_button_url: typeof r.cta_button_url === 'string' ? r.cta_button_url.trim().slice(0, 500) : '',
  };
}

export function applyDistributionSettingsToContentJson(
  contentJson: unknown,
  settings: Partial<DistributionSettings>,
): TiptapNode {
  const base: Record<string, unknown> =
    contentJson && typeof contentJson === 'object'
      ? { ...(contentJson as Record<string, unknown>) }
      : { type: 'doc', content: [{ type: 'paragraph' }] };

  const currentSettings = extractDistributionSettings(base);
  const nextSettings: DistributionSettings = {
    ...currentSettings,
    ...settings,
  };

  const meta = base.meta && typeof base.meta === 'object' ? { ...(base.meta as Record<string, unknown>) } : {};
  meta.distribution_settings = nextSettings;

  const attrs = base.attrs && typeof base.attrs === 'object' ? { ...(base.attrs as Record<string, unknown>) } : {};
  attrs.distribution_settings = nextSettings;

  return {
    ...base,
    distribution_settings: nextSettings,
    meta,
    attrs,
  } as TiptapNode;
}


