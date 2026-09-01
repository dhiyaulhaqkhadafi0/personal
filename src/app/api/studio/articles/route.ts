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

  const payload = (await request.json().catch(() => ({}))) as { title?: string };
  const title = payload.title?.trim() || 'Untitled story';
  const slug = `${slugify(title) || 'untitled'}-${Date.now().toString(36)}`;

  const { data, error } = await auth.client
    .from('blog_articles')
    .insert({
      author_id: auth.user.id,
      title,
      slug,
      content_json: emptyTiptapDocument,
    })
    .select('*')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ article: data }, { status: 201 });
}
