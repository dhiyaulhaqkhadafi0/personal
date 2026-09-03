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

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: { error?: { message?: string; status?: string } } | null = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // ignore
      }

      const msg = errorJson?.error?.message || response.statusText || 'Gagal menghubungi penyedia AI.';
      console.error(`Gemini Repurposing Error (${response.status}):`, msg);

      if (response.status === 400 && msg.includes('API key not valid')) {
        return Response.json(
          { error: 'GEMINI_API_KEY tidak valid. Silakan periksa kunci API Anda di environment.' },
          { status: 401 }
        );
      }
      if (response.status === 404) {
        return Response.json(
          { error: 'Model Gemini tidak ditemukan atau tidak didukung pada versi API saat ini. Periksa nilai GEMINI_MODEL.' },
          { status: 502 }
        );
      }
      if (response.status === 429) {
        return Response.json(
          { error: 'Batas kuota penyedia AI tercapai. Silakan coba beberapa saat lagi.' },
          { status: 429 }
        );
      }

      return Response.json(
        { error: 'Penyedia AI mengembalikan kesalahan saat memproses permintaan repurposing.' },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Check Prompt-level Safety Blocks
    if (data?.promptFeedback?.blockReason) {
      return Response.json(
        {
          error: `Naskah tidak dapat diproses karena dibatasi oleh filter keselamatan penyedia AI (${data.promptFeedback.blockReason}).`,
        },
        { status: 422 }
      );
    }

    const candidate = data?.candidates?.[0];

    // Check Candidate-level Finish Reasons
    if (candidate?.finishReason === 'SAFETY') {
      return Response.json(
        { error: 'Hasil respon disaring oleh filter keselamatan penyedia AI (SAFETY).' },
        { status: 422 }
      );
    }
    if (candidate?.finishReason === 'RECITATION') {
      return Response.json(
        { error: 'Hasil respon dibatasi oleh filter hak cipta / kutipan penyedia AI (RECITATION).' },
        { status: 422 }
      );
    }

    const rawResult: string = candidate?.content?.parts?.[0]?.text || '';

    if (!rawResult.trim()) {
      const reason = candidate?.finishReason || 'NO_CANDIDATE';
      return Response.json(
        { error: `Penyedia AI tidak menghasilkan teks untuk repurposing ini (status: ${reason}). Coba sesuaikan naskah atau coba lagi.` },
        { status: 502 }
      );
    }

    // Parse and validate structured JSON
    try {
      const parsedData = parseRepurposingResponse(rawResult, platform as RepurposingPlatform);
      return Response.json({
        ok: true,
        data: parsedData,
      });
    } catch (parseErr) {
      const parseMsg = parseErr instanceof Error ? parseErr.message : 'Format data AI tidak sesuai spesifikasi.';
      return Response.json({ error: parseMsg }, { status: 502 });
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return Response.json(
        { error: 'Permintaan ke penyedia AI melebihi batas waktu (timeout 30 detik). Silakan coba lagi.' },
        { status: 504 }
      );
    }

    console.error('AI Repurposing unexpected error:', err);
    return Response.json(
      { error: 'Terjadi gangguan jaringan saat memproses naskah dengan AI.' },
      { status: 500 }
    );
  }
}
