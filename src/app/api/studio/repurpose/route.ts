import { requireBlogAdmin } from '@/lib/blog-auth';
import {
  type RepurposingPlatform,
  type ContentGoal,
  type ContentTone,
  type ContentCta,
  type RepurposingRequestPayload,
  REPURPOSING_PLATFORMS,
  CONTENT_GOALS,
  CONTENT_TONES,
  CONTENT_CTAS,
} from '@/lib/repurposing-types';
import {
  buildRepurposingPrompt,
  parseRepurposingResponse,
} from '@/lib/repurposing-ai';
import { callGeminiApi } from '@/lib/gemini-provider';

export const dynamic = 'force-dynamic';

const VALID_PLATFORMS = new Set<string>(REPURPOSING_PLATFORMS.map((p) => p.id));
const VALID_GOALS = new Set<string>(CONTENT_GOALS.map((g) => g.id));
const VALID_TONES = new Set<string>(CONTENT_TONES.map((t) => t.id));
const VALID_CTAS = new Set<string>(CONTENT_CTAS.map((c) => c.id));

export async function GET(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  return Response.json({
    configured: Boolean(apiKey && model),
  });
}

export async function POST(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  if (!apiKey || !model) {
    return Response.json(
      {
        ok: false,
        configured: false,
        error: 'Penyedia AI belum dikonfigurasi. Pastikan GEMINI_API_KEY dan GEMINI_MODEL telah diatur di environment server.',
      },
      { status: 503 }
    );
  }

  let bodyData: RepurposingRequestPayload;
  try {
    bodyData = await request.json();
  } catch {
    return Response.json({ error: 'Format JSON payload tidak valid.' }, { status: 400 });
  }

  const { platform, goal, tone, cta, article } = bodyData;

  if (!platform || !VALID_PLATFORMS.has(platform)) {
    return Response.json({ error: 'Platform media sosial tidak valid atau belum didukung.' }, { status: 400 });
  }
  if (!goal || !VALID_GOALS.has(goal)) {
    return Response.json({ error: 'Tujuan konten tidak valid.' }, { status: 400 });
  }
  if (!tone || !VALID_TONES.has(tone)) {
    return Response.json({ error: 'Gaya bahasa tidak valid.' }, { status: 400 });
  }
  if (!cta || !VALID_CTAS.has(cta)) {
    return Response.json({ error: 'Ajakan bertindak (CTA) tidak valid.' }, { status: 400 });
  }

  if (!article || typeof article !== 'object') {
    return Response.json({ error: 'Data naskah artikel wajib disertakan.' }, { status: 400 });
  }

  const cleanTitle = (article.title || '').slice(0, 300).trim();
  const cleanExcerpt = (article.excerpt || '').slice(0, 500).trim();
  const cleanBody = (article.body || '').slice(0, 15000).trim();
  const cleanCategory = (article.category || 'Teknologi').slice(0, 100).trim();
  const cleanSlug = (article.slug || '').slice(0, 200).trim();
  const status = article.status === 'published' ? 'published' : 'draft';
  const canonicalUrl = status === 'published' && cleanSlug
    ? `https://khadafi.my.id/blog/${cleanSlug}`
    : undefined;

  if (!cleanTitle && !cleanBody) {
    return Response.json(
      { error: 'Naskah artikel kosong. Tulis judul atau isi artikel sebelum membuat turunan konten.' },
      { status: 400 }
    );
  }

  const { systemInstruction, userPrompt } = buildRepurposingPrompt({
    platform: platform as RepurposingPlatform,
    goal: goal as ContentGoal,
    tone: tone as ContentTone,
    cta: cta as ContentCta,
    article: {
      title: cleanTitle,
      excerpt: cleanExcerpt,
      body: cleanBody,
      category: cleanCategory,
      slug: cleanSlug,
      status,
      canonical_url: canonicalUrl,
    },
  });

  const geminiResult = await callGeminiApi({
    model,
    apiKey,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemInstruction}\n\n---\n\n${userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2500,
      responseMimeType: 'application/json',
    },
    timeoutMs: 30000,
  });

  if (!geminiResult.ok) {
    return Response.json(
      {
        ok: false,
        error: geminiResult.error,
        code: geminiResult.code,
        requestId: geminiResult.requestId,
      },
      { status: geminiResult.status }
    );
  }

  // Parse and validate structured JSON
  try {
    const parsedData = parseRepurposingResponse(geminiResult.text, platform as RepurposingPlatform);
    return Response.json({
      ok: true,
      data: parsedData,
      requestId: geminiResult.requestId,
    });
  } catch (parseErr) {
    console.error(`[Repurpose:${geminiResult.requestId}] JSON parse error:`, parseErr);
    return Response.json(
      {
        ok: false,
        error: 'Respons AI tidak memiliki format yang dapat dibaca. Coba generate ulang.',
        code: 'GEMINI_INVALID_STRUCTURED_JSON',
        requestId: geminiResult.requestId,
      },
      { status: 502 }
    );
  }
}
