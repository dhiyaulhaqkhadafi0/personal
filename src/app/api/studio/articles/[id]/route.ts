import { requireBlogAdmin } from '@/lib/blog-auth';

export const dynamic = 'force-dynamic';

const editableFields = [
  'title', 'slug', 'excerpt', 'content_json', 'content_html', 'status', 'category',
  'cover_url', 'cover_slides', 'theme', 'accent', 'music_uri', 'music_mood',
  'music_enabled', 'seo_title', 'seo_description', 'og_image', 'word_count', 'reading_time',
] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const payload = (await request.json()) as Record<string, unknown>;
  const values: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const field of editableFields) if (field in payload) values[field] = payload[field];
  if (payload.status === 'published') values.published_at = new Date().toISOString();

  const { data, error } = await auth.client
    .from('blog_articles')
    .update(values)
    .eq('id', id)
    .eq('author_id', auth.user.id)
    .select('*')
    .single();

  if (error) {
    return Response.json(
      { error: error.code === '23505' ? 'Slug ini sudah digunakan artikel lain.' : error.message },
      { status: error.code === '23505' ? 409 : 500 },
    );
  }
  return Response.json({ article: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const { error } = await auth.client
    .from('blog_articles')
    .delete()
    .eq('id', id)
    .eq('author_id', auth.user.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
