import { NextResponse } from 'next/server';
import { getAllPublishedArticlesEngagement } from '@/lib/engagement';

export const dynamic = 'force-dynamic';

/**
 * GET /api/engagement
 * Returns real engagement stats (view_count, like_count) for all published articles.
 * Strictly read-only; does NOT increment views and does NOT issue tokens.
 */
export async function GET() {
  try {
    const data = await getAllPublishedArticlesEngagement();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('Error reading published articles engagement:', err);
    return NextResponse.json({}, { status: 200 });
  }
}
