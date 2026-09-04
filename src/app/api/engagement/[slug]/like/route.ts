import { NextResponse } from 'next/server';
import {
  getOrCreateVisitorId,
  hashVisitorId,
  getEngagementSigningSecret,
  toggleEngagementLike,
  VISITOR_COOKIE_NAME,
  VISITOR_COOKIE_MAX_AGE,
} from '@/lib/engagement';

export const dynamic = 'force-dynamic';

const SLUG_REGEX = /^[a-z0-9-]+$/i;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json({ error: 'Slug tidak valid' }, { status: 400 });
    }

    // Fail closed if signing secret is missing
    if (!getEngagementSigningSecret()) {
      return NextResponse.json(
        { error: 'Layanan engagement belum dikonfigurasi (ENGAGEMENT_SIGNING_SECRET tidak tersedia).' },
        { status: 503 }
      );
    }

    // Origin verification for write protection
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      const originHost = origin.replace(/^https?:\/\//, '').split(':')[0];
      const reqHost = host.split(':')[0];
      if (originHost !== reqHost && originHost !== 'localhost') {
        return NextResponse.json({ error: 'Cross-origin action forbidden' }, { status: 403 });
      }
    }

    const { visitorId, isNew } = await getOrCreateVisitorId();
    const visitorHash = hashVisitorId(visitorId);

    const stats = await toggleEngagementLike(slug, visitorHash);

    if (!stats) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan atau belum dipublikasikan.' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        ok: true,
        like_count: stats.like_count,
        viewer_has_liked: stats.viewer_has_liked,
        view_count: stats.view_count,
      },
      { status: 200 }
    );

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
    console.error('Error in POST /api/engagement/[slug]/like:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
