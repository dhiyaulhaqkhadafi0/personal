import { NextResponse } from 'next/server';
import {
  getOrCreateVisitorId,
  hashVisitorId,
  recordEngagementView,
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

    // Origin / Sec-Fetch-Site verification for write protection
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      const originHost = origin.replace(/^https?:\/\//, '').split(':')[0];
      const reqHost = host.split(':')[0];
      if (originHost !== reqHost && originHost !== 'localhost') {
        return NextResponse.json({ error: 'Cross-origin view registration forbidden' }, { status: 403 });
      }
    }

    const body = (await request.json().catch(() => ({}))) as {
      duration_seconds?: number;
      visible_seconds?: number;
    };

    const durationSeconds = Number(body.duration_seconds || 0);
    const visibleSeconds = Number(body.visible_seconds || 0);

    // Rule: Must be actively visible on page for at least 8 seconds
    if (durationSeconds < 8 || visibleSeconds < 8) {
      return NextResponse.json(
        { error: 'Pembacaan belum memenuhi durasi minimal 8 detik aktif.' },
        { status: 400 }
      );
    }

    const { visitorId, isNew } = await getOrCreateVisitorId();
    const visitorHash = hashVisitorId(visitorId);

    const stats = await recordEngagementView(slug, visitorHash);

    if (!stats) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan atau belum dipublikasikan.' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        ok: true,
        view_count: stats.view_count,
        like_count: stats.like_count,
        viewer_has_liked: stats.viewer_has_liked,
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
    console.error('Error in POST /api/engagement/[slug]/view:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
