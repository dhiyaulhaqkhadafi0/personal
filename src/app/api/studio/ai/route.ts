import { requireBlogAdmin } from '@/lib/blog-auth';
import {
  type AiAction,
  buildPromptForAction,
  SELECTION_ACTIONS,
  ARTICLE_ACTIONS,
} from '@/lib/editorial-ai';

export const dynamic = 'force-dynamic';

const VALID_ACTIONS = new Set<AiAction>([
  ...SELECTION_ACTIONS.map((a) => a.id),
  ...ARTICLE_ACTIONS.map((a) => a.id),
]);

export async function GET(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-1.5-flash';

  return Response.json({
    configured: Boolean(apiKey),
    model: Boolean(apiKey) ? model : null,
  });
}

export async function POST(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-1.5-flash';

  if (!apiKey) {
    return Response.json(
      {
        ok: false,
        configured: false,
        error: 'AI Editorial belum dikonfigurasi. Tambahkan GEMINI_API_KEY di environment server Anda.',
      },
      { status: 503 }
    );
  }

  let bodyData: {
    action?: string;
    selection?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    customHint?: string;
  };

  try {
    bodyData = await request.json();
  } catch {
    return Response.json({ error: 'Format JSON payload tidak valid.' }, { status: 400 });
  }

  const { action, selection = '', title = '', excerpt = '', body = '', customHint = '' } = bodyData;

  if (!action || !VALID_ACTIONS.has(action as AiAction)) {
    return Response.json({ error: 'Aksi AI tidak dikenali atau tidak valid.' }, { status: 400 });
  }

  const aiAction = action as AiAction;

  const cleanSelection = selection.slice(0, 4000).trim();
  const cleanTitle = title.slice(0, 300).trim();
  const cleanExcerpt = excerpt.slice(0, 500).trim();
  const cleanBody = body.slice(0, 12000).trim();
  const cleanHint = customHint.slice(0, 300).trim();

  // Selected text actions require non-empty selection
  const isSelectionAction = SELECTION_ACTIONS.some((a) => a.id === aiAction);
  if (isSelectionAction && !cleanSelection) {
    return Response.json(
      { error: 'Teks terpilih tidak boleh kosong untuk aksi ini.' },
      { status: 400 }
    );
  }

  const { systemInstruction, userPrompt } = buildPromptForAction(aiAction, {
    selection: cleanSelection,
    title: cleanTitle,
    excerpt: cleanExcerpt,
    body: cleanBody,
    customHint: cleanHint,
  });

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

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
          temperature: 0.35,
          maxOutputTokens: 2048,
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
      console.error(`Gemini API Error (${response.status}):`, msg);

      if (response.status === 400 && msg.includes('API key not valid')) {
        return Response.json(
          { error: 'GEMINI_API_KEY tidak valid. Silakan periksa kunci API Anda.' },
          { status: 401 }
        );
      }
      if (response.status === 429) {
        return Response.json(
          { error: 'Batas kuota penyedia AI tercapai. Silakan coba lagi beberapa saat lagi.' },
          { status: 429 }
        );
      }

      return Response.json(
        { error: 'Penyedia AI mengembalikan kesalahan saat memproses permintaan.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawResult: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawResult.trim()) {
      return Response.json(
        { error: 'Penyedia AI tidak menghasilkan teks untuk naskah ini.' },
        { status: 502 }
      );
    }

    return Response.json({
      ok: true,
      result: rawResult.trim(),
      action: aiAction,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return Response.json(
        { error: 'Permintaan ke penyedia AI melebihi batas waktu (timeout 25 detik). Silakan coba lagi.' },
        { status: 504 }
      );
    }

    console.error('AI Co-Pilot unexpected error:', err);
    return Response.json(
      { error: 'Terjadi gangguan jaringan saat memproses naskah dengan AI.' },
      { status: 500 }
    );
  }
}
