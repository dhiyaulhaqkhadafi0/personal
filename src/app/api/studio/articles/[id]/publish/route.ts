import { revalidatePath } from 'next/cache';
import { requireBlogAdmin } from '@/lib/blog-auth';

export const dynamic = 'force-dynamic';

type RpcResult = {
  ok: boolean;
  id: string;
  slug: string;
  snapshot?: unknown;
};

/**
 * POST /api/studio/articles/[id]/publish
 *
 * Calls the atomic PostgreSQL RPC `publish_article(article_id)`.
 * The RPC:
 *   - Validates admin via private.is_blog_admin() (server-side, no client bypass)
 *   - Validates article ownership via author_id = auth.uid()
 *   - Upserts published_blog_articles AND updates blog_articles.status in one transaction
 *   - Returns error and rolls back if either operation fails
 *
 * After success, invalidates Next.js cache for the blog listing and article pages.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;

  const { data, error } = await auth.client.rpc('publish_article', {
    article_id: id,
  });

  if (error) {
    const status =
      error.code === '23505' ? 409   // slug conflict
      : error.code === '42501' ? 403  // not admin
      : error.code === '02000' ? 404  // not found
      : 500;

    const message =
      error.code === '23505' ? 'Slug ini sudah digunakan artikel lain.'
      : error.code === '42501' ? 'Akun ini tidak memiliki akses.'
      : error.code === '02000' ? 'Artikel tidak ditemukan.'
      : error.message;

    return Response.json({ error: message }, { status });
  }

  const result = data as RpcResult;

  // Invalidate Next.js page cache so the next visitor sees fresh content
  revalidatePath('/blog');
  revalidatePath(`/blog/${result.slug}`);

  return Response.json({ ok: true, id: result.id, slug: result.slug });
}

/**
 * DELETE /api/studio/articles/[id]/publish
 *
 * Calls the atomic PostgreSQL RPC `unpublish_article(article_id)`.
 * The RPC:
 *   - Validates admin + ownership
 *   - Deletes published_blog_articles row AND reverts blog_articles.status in one transaction
 *   - Working draft content is preserved
 *
 * After success, invalidates Next.js cache so the article 404s immediately.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;

  const { data, error } = await auth.client.rpc('unpublish_article', {
    article_id: id,
  });

  if (error) {
    const status =
      error.code === '42501' ? 403
      : error.code === '02000' ? 404
      : 500;

    const message =
      error.code === '42501' ? 'Akun ini tidak memiliki akses.'
      : error.code === '02000' ? 'Artikel tidak ditemukan.'
      : error.message;

    return Response.json({ error: message }, { status });
  }

  const result = data as RpcResult;

  // Invalidate cache: article should now return 404 for visitors
  revalidatePath('/blog');
  revalidatePath(`/blog/${result.slug}`);

  // Return the updated article state for BlogStudio UI to reflect
  const { data: updatedDraft } = await auth.client
    .from('blog_articles')
    .select('*')
    .eq('id', id)
    .single();

  return Response.json({ article: updatedDraft });
}
