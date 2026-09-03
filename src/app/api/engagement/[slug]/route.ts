import { NextResponse } from 'next/server';
import {
  getOrCreateVisitorId,
  hashVisitorId,
  getEngagementForArticle,
  VISITOR_COOKIE_NAME,
  VISITOR_COOKIE_MAX_AGE,
} from '@/lib/engagement';

export const dynamic = 'force-dynamic';

const SLUG_REGEX = /^[a-z0-9-]+$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json({ error: 'Slug tidak valid' }, { status: 400 });
    }

    const { visitorId, isNew } = await getOrCreateVisitorId();
    const visitorHash = hashVisitorId(visitorId);

    const stats = await getEngagementForArticle(slug, visitorHash);

    if (!stats) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan atau belum dipublikasikan.' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        view_count: stats.view_count,
        like_count: stats.like_count,
        viewer_has_liked: stats.viewer_has_liked,
      },
      { status: 200 }
    );

    // Set privacy-first HTTP-only cookie if new
    if (isNew) {
      response.cookies.set({
        name: VISITOR_COOKIE_NAME,
        value: visitorId,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: VISITOR_COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (err: unknown) {
    console.error('Error in GET /api/engagement/[slug]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
