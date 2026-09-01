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
  created_at: string;
  updated_at: string;
};

export const emptyTiptapDocument: TiptapNode = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

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
