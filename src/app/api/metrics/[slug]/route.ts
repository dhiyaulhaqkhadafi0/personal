import { NextResponse } from 'next/server';
import { supabase, createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const SLUG_REGEX = /^[a-z0-9-]+$/i;

/**
 * GET /api/metrics/[slug]
 * Reads view_count and ignite_count using the anon key.
 * Requires SELECT privilege on public.blog_metrics for anon.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json({ error: 'Slug tidak valid' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blog_metrics')
      .select('view_count, ignite_count')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching metrics:', error.message);
      return NextResponse.json({ error: 'Gagal mengambil metrics' }, { status: 500 });
    }

    return NextResponse.json(
      {
        view_count: data?.view_count ?? 0,
        ignite_count: data?.ignite_count ?? 0,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Unexpected error in GET metrics:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/metrics/[slug]
 *
 * Atomic increment for view or ignite count using PostgreSQL RPC `increment_blog_metric`.
 * Abuse protection (V1):
 *   - First-party HTTP-only cookie per slug (24 hours expiry)
 *   - If cookie already present, skips DB write and returns current metrics without incrementing
 *   - Service role key is kept strictly on server (never exposed to browser client)
 *   - Graceful degradation if SUPABASE_SERVICE_ROLE_KEY is not yet configured
 *
 * Note: For high-scale DDoS protection, IP/KV/Cloudflare WAF rate limiting can be added
 * as an infrastructure layer in future phases.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json({ error: 'Slug tidak valid' }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as { type?: string };
    const { type } = body;

    if (type !== 'view' && type !== 'ignite') {
      return NextResponse.json(
        { error: 'Invalid type. Harus "view" atau "ignite".' },
        { status: 400 },
      );
    }

    // --- Abuse Control (First-Party Cookie Check) ---
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cookieName = `khadafi_metric_${type}_${sanitizedSlug}`;
    const cookieHeader = request.headers.get('cookie') || '';
    const isThrottled = cookieHeader
      .split(';')
      .some((c) => c.trim().startsWith(`${cookieName}=`));

    if (isThrottled) {
      // Return current counts without incrementing
      const { data: current } = await supabase
        .from('blog_metrics')
        .select('view_count, ignite_count')
        .eq('slug', slug)
        .maybeSingle();

      return NextResponse.json(
        {
          view_count: current?.view_count ?? 0,
          ignite_count: current?.ignite_count ?? 0,
          throttled: true,
        },
        { status: 200 },
      );
    }

    // --- Server-side Service Role Client ---
    let db: ReturnType<typeof createServiceRoleClient>;
    try {
      db = createServiceRoleClient();
    } catch {
      // Graceful degradation: log warning and return current metrics
      console.warn('SUPABASE_SERVICE_ROLE_KEY not configured — metrics increment skipped.');
      const { data: current } = await supabase
        .from('blog_metrics')
        .select('view_count, ignite_count')
        .eq('slug', slug)
        .maybeSingle();

      return NextResponse.json(
        {
          view_count: current?.view_count ?? 0,
          ignite_count: current?.ignite_count ?? 0,
          skipped: true,
        },
        { status: 200 },
      );
    }

    // --- Atomic PostgreSQL RPC Call (No manual read-then-write fallback) ---
    const { data, error } = await db.rpc('increment_blog_metric', {
      p_slug: slug,
      p_type: type,
    });

    if (error) {
      if (error.code === '02000') {
        return NextResponse.json(
          { error: 'Artikel tidak ditemukan atau belum dipublikasikan.' },
          { status: 404 },
        );
      }
      console.error('Error executing increment_blog_metric RPC:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const payload = (data as { view_count?: number; ignite_count?: number }) ?? {
      view_count: 0,
      ignite_count: 0,
    };

    // Set 24h first-party cookie on the response
    const response = NextResponse.json(payload, { status: 200 });
    response.cookies.set({
      name: cookieName,
      value: '1',
      maxAge: 86400, // 24 hours
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Unexpected error in POST metrics:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
