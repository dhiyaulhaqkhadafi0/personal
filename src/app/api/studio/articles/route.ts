import { requireBlogAdmin } from '@/lib/blog-auth';
import { emptyTiptapDocument, slugify } from '@/lib/blog-types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.client
    .from('blog_articles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ articles: data || [] });
}

export async function POST(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const payload = (await request.json().catch(() => ({}))) as {
    title?: string;
    slug?: string;
    content_json?: unknown;
    content_html?: string;
    excerpt?: string;
    category?: string;
  };

  const title = payload.title?.trim() || 'Untitled story';
  const slug = payload.slug?.trim() || `${slugify(title) || 'untitled'}-${Date.now().toString(36)}`;
  const content_json = payload.content_json || emptyTiptapDocument;
  const content_html = payload.content_html || '';
  const excerpt = payload.excerpt || '';
  const category = payload.category || 'Ideas';

  const text = typeof content_html === 'string' ? content_html.replace(/<[^>]*>/g, '').trim() : '';
  const word_count = text ? text.split(/\s+/).length : 0;
  const reading_time = Math.max(1, Math.ceil(word_count / 210));

  const { data, error } = await auth.client
    .from('blog_articles')
    .insert({
      author_id: auth.user.id,
      title,
      slug,
      content_json,
      content_html,
      excerpt,
      category,
      word_count,
      reading_time,
    })
    .select('*')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ article: data }, { status: 201 });
}
