import type { User } from '@supabase/supabase-js';
import { createAuthenticatedSupabaseClient, isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthSuccess = {
  ok: true;
  user: User;
  accessToken: string;
  client: ReturnType<typeof createAuthenticatedSupabaseClient>;
};

type AuthFailure = {
  ok: false;
  response: Response;
};

export async function requireBlogAdmin(request: Request): Promise<AuthSuccess | AuthFailure> {
  if (!isSupabaseConfigured) {
    return { ok: false, response: Response.json({ error: 'Supabase belum dikonfigurasi.' }, { status: 503 }) };
  }

  const accessToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!accessToken) {
    return { ok: false, response: Response.json({ error: 'Silakan login kembali.' }, { status: 401 }) };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return { ok: false, response: Response.json({ error: 'Sesi tidak valid atau sudah berakhir.' }, { status: 401 }) };
  }

  const adminEmail = process.env.BLOG_ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return { ok: false, response: Response.json({ error: 'BLOG_ADMIN_EMAIL belum diatur di environment.' }, { status: 503 }) };
  }

  if (data.user.email?.toLowerCase() !== adminEmail) {
    return { ok: false, response: Response.json({ error: 'Akun ini tidak memiliki akses ke Blog Studio.' }, { status: 403 }) };
  }

  return {
    ok: true,
    user: data.user,
    accessToken,
    client: createAuthenticatedSupabaseClient(accessToken),
  };
}
