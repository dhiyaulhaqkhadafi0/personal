import { requireBlogAdmin } from '@/lib/blog-auth';
import { slugify } from '@/lib/blog-types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  // 1. Fetch source article (draft or published)
  const { data: source, error: fetchError } = await auth.client
    .from('blog_articles')
    .select('*')
    .eq('id', id)
    .eq('author_id', auth.user.id)
    .maybeSingle();

  if (fetchError || !source) {
    return Response.json(
      { error: 'Artikel sumber tidak ditemukan atau Anda tidak memiliki akses.' },
      { status: 404 }
    );
  }

  // 2. Generate unique slug server-side
  const baseTitle = source.title ? source.title.trim() : 'Untitled story';
  const newTitle = `Salinan — ${baseTitle}`;
  const baseSlug = `${slugify(source.slug || source.title || 'artikel')}-salinan`;
  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const { data: existing } = await auth.client
      .from('blog_articles')
      .select('id')
      .eq('slug', candidateSlug)
      .maybeSingle();

    if (!existing) break;
    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
  }

  // 3. Insert duplicated article strictly as draft
  const now = new Date().toISOString();
  const insertPayload = {
    author_id: auth.user.id,
    status: 'draft',
    title: newTitle,
    slug: candidateSlug,
    content_json: source.content_json,
    content_html: source.content_html,
    excerpt: source.excerpt || '',
    category: source.category || 'Ideas',
    cover_url: source.cover_url || '',
    cover_slides: source.cover_slides || [],
    theme: source.theme || 'midnight',
    accent: source.accent || 'emerald',
    music_uri: source.music_uri || '',
    music_mood: source.music_mood || '',
    music_enabled: Boolean(source.music_enabled),
    seo_title: source.seo_title ? `Salinan — ${source.seo_title}` : '',
    seo_description: source.seo_description || source.excerpt || '',
    og_image: source.og_image || source.cover_url || '',
    word_count: source.word_count || 0,
    reading_time: source.reading_time || 1,
    published_at: null,
    last_published_at: null,
    created_at: now,
    updated_at: now,
  };

  const { data: duplicated, error: insertError } = await auth.client
    .from('blog_articles')
    .insert(insertPayload)
    .select('*')
    .single();

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  return Response.json({ article: duplicated, ok: true }, { status: 201 });
}
