import { NextResponse } from 'next/server';
import { supabase, createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/metrics/[slug]
 * Reads view_count and ignite_count using the anon key.
 * Requires "Metrics are publicly readable" RLS policy (SELECT USING true).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from('blog_metrics')
      .select('view_count, ignite_count')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching metrics:', error);
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ view_count: 0, ignite_count: 0 }, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/metrics/[slug]
 * Atomically increments view or ignite count using the service_role key.
 *
 * The service_role key bypasses RLS — this is intentional. Only the Next.js
 * server can call this endpoint, so we control the trust boundary here.
 * Anon clients cannot write directly to blog_metrics (no write policy exists).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const body = await request.json() as { type?: string };
    const { type } = body;

    if (type !== 'view' && type !== 'ignite') {
      return NextResponse.json({ error: 'Invalid type. Must be "view" or "ignite".' }, { status: 400 });
    }

    // Use service_role client: bypasses RLS so we can safely upsert
    // without needing a public write policy on blog_metrics
    let db: ReturnType<typeof createServiceRoleClient>;
    try {
      db = createServiceRoleClient();
    } catch {
      // Graceful degradation: if service role key is not set, skip metric increment
      // This prevents metrics from breaking the entire article rendering
      console.warn('SUPABASE_SERVICE_ROLE_KEY not set — metrics increment skipped.');
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
    }

    const incrementColumn = type === 'view' ? 'view_count' : 'ignite_count';

    // Atomic upsert using PostgreSQL-level increment
    // INSERT ... ON CONFLICT DO UPDATE ensures no race condition
    const { data, error } = await db.rpc('increment_metric', {
      p_slug: slug,
      p_column: incrementColumn,
    });

    if (error) {
      // Fallback: RPC might not exist yet, try manual upsert
      console.warn('increment_metric RPC not available, using manual upsert:', error.message);
      return await manualIncrement(db, slug, type);
    }

    return NextResponse.json(data ?? { ok: true }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Fallback: manual read-then-write increment.
 * Less ideal for high concurrency but acceptable for a personal blog.
 */
async function manualIncrement(
  db: ReturnType<typeof createServiceRoleClient>,
  slug: string,
  type: 'view' | 'ignite',
) {
  const { data: existing } = await db
    .from('blog_metrics')
    .select('view_count, ignite_count')
    .eq('slug', slug)
    .single();

  const newValues = {
    slug,
    view_count: type === 'view'
      ? (Number(existing?.view_count ?? 0) + 1)
      : Number(existing?.view_count ?? 0),
    ignite_count: type === 'ignite'
      ? (Number(existing?.ignite_count ?? 0) + 1)
      : Number(existing?.ignite_count ?? 0),
  };

  const { data: upserted, error: upsertError } = await db
    .from('blog_metrics')
    .upsert(newValues, { onConflict: 'slug' })
    .select()
    .single();

  if (upsertError) {
    return NextResponse.json({ error: 'Failed to update metrics' }, { status: 500 });
  }

  return NextResponse.json(upserted, { status: 200 });
}
