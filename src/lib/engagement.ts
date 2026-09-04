import crypto from 'crypto';
import { supabase, createServiceRoleClient } from './supabase';
import { cookies } from 'next/headers';

export const VISITOR_COOKIE_NAME = 'khadafi_vid';
export const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Retrieves the mandatory HMAC signing secret from environment.
 * STRICT: Absolutely NO fallback allowed. Fails closed if missing or empty.
 */
export function getEngagementSigningSecret(): string | null {
  const secret = process.env.ENGAGEMENT_SIGNING_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    return null;
  }
  return secret.trim();
}

// Secure one-way hashing for privacy-first anonymous visitor identification
export function hashVisitorId(visitorId: string): string {
  const salt = process.env.ENGAGEMENT_SALT || 'khadafi_reader_privacy_salt_2026';
  return crypto.createHash('sha256').update(`${visitorId}:${salt}`).digest('hex');
}

/**
 * Retrieves existing anonymous visitor ID from cookie or generates a new cryptographic UUID.
 * Returns both the visitorId and whether a new cookie needs to be set on the response.
 */
export async function getOrCreateVisitorId(): Promise<{ visitorId: string; isNew: boolean }> {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
    if (existing && existing.length >= 16) {
      return { visitorId: existing, isNew: false };
    }
  } catch {
    // In edge runtime or during static build
  }

  const newId = crypto.randomUUID();
  return { visitorId: newId, isNew: true };
}

/**
 * Generates a tamper-proof cryptographic view start token bound to:
 * - slug
 * - visitor_hash
 * - server timestamp
 *
 * FAILS CLOSED if ENGAGEMENT_SIGNING_SECRET is not available.
 */
export function generateViewToken(slug: string, visitorHash: string): string | null {
  const secret = getEngagementSigningSecret();
  if (!secret) {
    // Fail closed: Never issue tokens without explicit runtime secret
    return null;
  }

  const timestamp = Date.now();
  const payload = `${slug}:${visitorHash}:${timestamp}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Verifies that the view token is valid, matches the current visitor and article,
 * and confirms that at least 8 real seconds have elapsed since generation.
 *
 * FAILS CLOSED if ENGAGEMENT_SIGNING_SECRET is not available.
 */
export function verifyViewToken(
  token: string,
  slug: string,
  visitorHash: string
): { valid: boolean; reason?: string } {
  const secret = getEngagementSigningSecret();
  if (!secret) {
    return {
      valid: false,
      reason: 'ENGAGEMENT_SIGNING_SECRET belum dikonfigurasi pada server (fail closed).',
    };
  }

  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Token pembacaan tidak ditemukan.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Format token pembacaan tidak valid.' };
  }

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { valid: false, reason: 'Timestamp token tidak valid.' };
  }

  const expectedPayload = `${slug}:${visitorHash}:${timestamp}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(expectedPayload).digest('hex');

  // Constant-time signature comparison to prevent timing attacks
  const providedBuf = Buffer.from(providedSignature, 'hex');
  const expectedBuf = Buffer.from(expectedSignature, 'hex');
  if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return { valid: false, reason: 'Tanda tangan token tidak valid atau telah dimodifikasi.' };
  }

  const now = Date.now();
  const elapsedMs = now - timestamp;

  // Enforce server-side 8-second active duration verification
  if (elapsedMs < 8000) {
    return { valid: false, reason: 'Waktu pembacaan belum mencapai 8 detik yang sah.' };
  }

  // Token expires after 10 minutes (600,000 ms)
  if (elapsedMs > 10 * 60 * 1000) {
    return { valid: false, reason: 'Token pembacaan telah kedaluwarsa. Silakan refresh halaman.' };
  }

  // Guard against tokens generated in the future
  if (timestamp > now + 5000) {
    return { valid: false, reason: 'Timestamp token berada di masa depan.' };
  }

  return { valid: true };
}

export type EngagementStats = {
  view_count: number | null;
  like_count: number | null;
  viewer_has_liked: boolean;
  view_token?: string | null;
  configured: boolean;
};

/**
 * Verifies whether an article exists in published_blog_articles.
 * Returns the article ID if published, or null if draft/not found.
 */
export async function verifyPublishedArticle(slug: string): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('published_blog_articles')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data;
}

/**
 * Fetches public engagement metrics and visitor like status for a published article.
 * Guarantees that only published articles return engagement. Drafts or non-existent slugs return null (404).
 * Fails closed if ENGAGEMENT_SIGNING_SECRET is not configured.
 */
export async function getEngagementForArticle(
  slug: string,
  visitorHash?: string
): Promise<EngagementStats | null> {
  // 1. Verify article is actually published (strictly 404 if not found or draft)
  const published = await verifyPublishedArticle(slug);
  if (!published) {
    return null;
  }

  // 2. Fail closed if signing secret is absent
  const secret = getEngagementSigningSecret();
  if (!secret) {
    return {
      view_count: null,
      like_count: null,
      viewer_has_liked: false,
      view_token: null,
      configured: false,
    };
  }

  const viewToken = visitorHash ? generateViewToken(slug, visitorHash) : null;

  // 3. Check if service role is available
  let db: ReturnType<typeof createServiceRoleClient>;
  try {
    db = createServiceRoleClient();
  } catch {
    return {
      view_count: 0,
      like_count: 0,
      viewer_has_liked: false,
      view_token: viewToken,
      configured: true,
    };
  }

  try {
    // 4. Call secure PostgreSQL RPC get_article_engagement
    const { data: rpcData, error: rpcError } = await db.rpc('get_article_engagement', {
      p_slug: slug,
      p_visitor_hash: visitorHash || '',
    });

    if (!rpcError && rpcData && typeof rpcData === 'object' && 'ok' in rpcData && rpcData.ok) {
      return {
        view_count: Number(rpcData.view_count || 0),
        like_count: Number(rpcData.like_count || 0),
        viewer_has_liked: Boolean(rpcData.viewer_has_liked),
        view_token: viewToken,
        configured: true,
      };
    }

    // Direct table query fallback
    const { data: engagement } = await db
      .from('article_engagement')
      .select('view_count, like_count')
      .eq('article_id', published.id)
      .maybeSingle();

    let viewerHasLiked = false;
    if (visitorHash) {
      const { data: likeRecord } = await db
        .from('article_likes')
        .select('id')
        .eq('article_id', published.id)
        .eq('visitor_hash', visitorHash)
        .maybeSingle();
      viewerHasLiked = Boolean(likeRecord);
    }

    return {
      view_count: Number(engagement?.view_count || 0),
      like_count: Number(engagement?.like_count || 0),
      viewer_has_liked: viewerHasLiked,
      view_token: viewToken,
      configured: true,
    };
  } catch {
    return {
      view_count: 0,
      like_count: 0,
      viewer_has_liked: false,
      view_token: viewToken,
      configured: true,
    };
  }
}

/**
 * Atomically records a view for the visitor hash on the current calendar day (UTC).
 * Validates that the article is published.
 */
export async function recordEngagementView(
  slug: string,
  visitorHash: string
): Promise<EngagementStats | null> {
  const published = await verifyPublishedArticle(slug);
  if (!published) {
    return null;
  }

  let db: ReturnType<typeof createServiceRoleClient>;
  try {
    db = createServiceRoleClient();
  } catch {
    return { view_count: 1, like_count: 0, viewer_has_liked: false, configured: true };
  }

  try {
    const { data, error } = await db.rpc('record_article_view', {
      p_slug: slug,
      p_visitor_hash: visitorHash,
    });

    if (error) {
      if (error.code === '02000' || error.message?.includes('NOT_FOUND')) {
        return null;
      }
      return getEngagementForArticle(slug, visitorHash);
    }

    return {
      view_count: Number(data?.view_count || 0),
      like_count: Number(data?.like_count || 0),
      viewer_has_liked: Boolean(data?.viewer_has_liked),
      configured: true,
    };
  } catch {
    return getEngagementForArticle(slug, visitorHash);
  }
}

/**
 * Atomically toggles like / unlike for the visitor hash.
 * Returns the updated like count and status.
 */
export async function toggleEngagementLike(
  slug: string,
  visitorHash: string
): Promise<EngagementStats | null> {
  const published = await verifyPublishedArticle(slug);
  if (!published) {
    return null;
  }

  let db: ReturnType<typeof createServiceRoleClient>;
  try {
    db = createServiceRoleClient();
  } catch {
    return { view_count: 0, like_count: 1, viewer_has_liked: true, configured: true };
  }

  try {
    const { data, error } = await db.rpc('toggle_article_like', {
      p_slug: slug,
      p_visitor_hash: visitorHash,
    });

    if (error) {
      if (error.code === '02000' || error.message?.includes('NOT_FOUND')) {
        return null;
      }
      throw new Error(error.message);
    }

    return {
      view_count: Number(data?.view_count || 0),
      like_count: Number(data?.like_count || 0),
      viewer_has_liked: Boolean(data?.viewer_has_liked),
      configured: true,
    };
  } catch {
    return { view_count: 0, like_count: 1, viewer_has_liked: true, configured: true };
  }
}

/**
 * Reads real engagement stats (views & likes) for all currently published articles.
 * Strictly read-only; does NOT issue tokens and does NOT increment views.
 * Safe for blog index and article listing cards.
 */
export async function getAllPublishedArticlesEngagement(): Promise<
  Record<string, { view_count: number; like_count: number }>
> {
  const result: Record<string, { view_count: number; like_count: number }> = {};

  try {
    const { data: articles, error: articlesErr } = await supabase
      .from('published_blog_articles')
      .select('id, slug');

    if (articlesErr || !articles || articles.length === 0) {
      return result;
    }

    for (const a of articles) {
      result[a.slug] = { view_count: 0, like_count: 0 };
    }

    let db: ReturnType<typeof createServiceRoleClient>;
    try {
      db = createServiceRoleClient();
    } catch {
      // Graceful fallback to 0 when service role is not configured locally
      return result;
    }

    const articleIds = articles.map((a) => a.id);
    const { data: engagements, error: engErr } = await db
      .from('article_engagement')
      .select('article_id, view_count, like_count')
      .in('article_id', articleIds);

    if (!engErr && engagements) {
      const idToSlug = new Map(articles.map((a) => [a.id, a.slug]));
      for (const e of engagements) {
        const slug = idToSlug.get(e.article_id);
        if (slug) {
          result[slug] = {
            view_count: Number(e.view_count || 0),
            like_count: Number(e.like_count || 0),
          };
        }
      }
    }
  } catch (err) {
    console.error('Error fetching all published articles engagement:', err);
  }

  return result;
}

