import { requireBlogAdmin } from '@/lib/blog-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Pilih gambar terlebih dahulu.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return Response.json({ error: 'Hanya file gambar yang didukung.' }, { status: 415 });
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: 'Ukuran gambar maksimal 8 MB.' }, { status: 413 });

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const path = `${auth.user.id}/${Date.now().toString(36)}-${crypto.randomUUID()}.${extension}`;
  const { error } = await auth.client.storage.from('blog-media').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  const { data } = auth.client.storage.from('blog-media').getPublicUrl(path);
  return Response.json({ url: data.publicUrl, path }, { status: 201 });
}
