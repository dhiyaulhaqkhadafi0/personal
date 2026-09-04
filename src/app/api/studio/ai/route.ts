import { requireBlogAdmin } from '@/lib/blog-auth';
import {
  type AiAction,
  buildPromptForAction,
  SELECTION_ACTIONS,
  ARTICLE_ACTIONS,
} from '@/lib/editorial-ai';
import { callGeminiApi } from '@/lib/gemini-provider';

export const dynamic = 'force-dynamic';

const VALID_ACTIONS = new Set<AiAction>([
  ...SELECTION_ACTIONS.map((a) => a.id),
  ...ARTICLE_ACTIONS.map((a) => a.id),
]);

export async function GET(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  // Both GEMINI_API_KEY and GEMINI_MODEL are strictly required.
  // Never expose sensitive keys or model names to the client.
  return Response.json({
    configured: Boolean(apiKey && model),
  });
}

export async function POST(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  // Explicit validation: both API Key and Model must be present. No fallback.
  if (!apiKey || !model) {
    return Response.json(
      {
        ok: false,
        configured: false,
        error: 'AI Editorial belum dikonfigurasi. Pastikan GEMINI_API_KEY dan GEMINI_MODEL telah diatur di environment server.',
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

  // Text editing actions strictly require non-empty text input
  const isSelectionAction = SELECTION_ACTIONS.some((a) => a.id === aiAction);
  if (isSelectionAction && !cleanSelection) {
    return Response.json(
      { error: 'Teks yang ingin diolah tidak boleh kosong untuk aksi ini.' },
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
      temperature: 0.35,
      maxOutputTokens: 2048,
    },
    timeoutMs: 25000,
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

  return Response.json({
    ok: true,
    result: geminiResult.text,
    action: aiAction,
    requestId: geminiResult.requestId,
  });
}
