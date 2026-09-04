/**
 * Google Gemini Provider Client for Blog Studio
 *
 * Implements:
 * - Official header authentication: `x-goog-api-key`
 * - Clean URL without query params
 * - Safe internal Request ID generation
 * - Request-time runtime environment binding resolution (Cloudflare Workers context & Node.js)
 * - Bounded retry for 429, timeouts, and 5xx (such as 503 high demand spikes)
 * - Immediate fail (no retry) for 400, 401, 403, 404
 * - User-safe, actionable Indonesian error messages without leaking secrets
 */

export type GeminiGenerationConfig = {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
};

export type GeminiPart = {
  text: string;
};

export type GeminiContent = {
  role: 'user' | 'model';
  parts: GeminiPart[];
};

export type GeminiCallParams = {
  model?: string;
  apiKey?: string;
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  timeoutMs?: number;
  maxRetries?: number;
};

export type GeminiSuccessResult = {
  ok: true;
  text: string;
  requestId: string;
};

export type GeminiErrorResult = {
  ok: false;
  error: string;
  status: number;
  code: string;
  requestId: string;
};

export type GeminiResult = GeminiSuccessResult | GeminiErrorResult;

export type GeminiRuntimeConfig = {
  configured: boolean;
  apiKey: string | null;
  model: string | null;
  missing: ('GEMINI_API_KEY' | 'GEMINI_MODEL')[];
};

/**
 * Resolves a runtime environment variable across Cloudflare Workers (workerd) and Node.js.
 * Strictly evaluated at request time, never at module import time.
 */
export function getRuntimeEnvVar(name: 'GEMINI_API_KEY' | 'GEMINI_MODEL'): string | null {
  const globalObj = globalThis as any;

  // 1. Cloudflare Workers context via AsyncLocalStorage (current request bindings & secrets)
  try {
    const contextSymbol = Symbol.for('__cloudflare-context__');
    const cfEnv = globalObj[contextSymbol]?.env;
    if (cfEnv && typeof cfEnv[name] === 'string' && cfEnv[name].trim().length > 0) {
      return cfEnv[name].trim();
    }
  } catch {
    // ignore
  }

  // 2. Standard process.env (Node.js runtime / .env.local / OpenNext populated)
  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[name];
      if (typeof val === 'string' && val.trim().length > 0) {
        return val.trim();
      }
    }
  } catch {
    // ignore
  }

  // 3. Global scope fallback (edge runtime worker global scope)
  try {
    const val = globalObj[name];
    if (typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  } catch {
    // ignore
  }

  // 4. Global env object fallback (some Cloudflare edge shims)
  try {
    const envObj = globalObj.env;
    if (envObj && typeof envObj[name] === 'string' && envObj[name].trim().length > 0) {
      return envObj[name].trim();
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Evaluates Gemini configuration at request time.
 * Returns safe diagnostic metadata (configured flag and list of missing variable names).
 * NEVER returns secret values, key length, prefix, or project names.
 */
export function getGeminiRuntimeConfig(): GeminiRuntimeConfig {
  const apiKey = getRuntimeEnvVar('GEMINI_API_KEY');
  const model = getRuntimeEnvVar('GEMINI_MODEL');

  const missing: ('GEMINI_API_KEY' | 'GEMINI_MODEL')[] = [];
  if (!apiKey) missing.push('GEMINI_API_KEY');
  if (!model) missing.push('GEMINI_MODEL');

  return {
    configured: missing.length === 0,
    apiKey,
    model,
    missing,
  };
}

/**
 * Quick boolean check whether Gemini runtime bindings are configured.
 * Strictly checks at request time.
 */
export function isGeminiConfigured(): boolean {
  return getGeminiRuntimeConfig().configured;
}

function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `req_${timestamp}_${randomPart}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isApiKeyInvalidMessage(msg: string, rawText: string): boolean {
  const lowerMsg = (msg + ' ' + rawText).toLowerCase();
  return (
    lowerMsg.includes('api key not valid') ||
    lowerMsg.includes('api_key_invalid') ||
    lowerMsg.includes('consumer_invalid') ||
    lowerMsg.includes('key has expired')
  );
}

export async function callGeminiApi({
  model,
  apiKey,
  contents,
  generationConfig,
  timeoutMs = 30000,
  maxRetries = 3,
}: GeminiCallParams): Promise<GeminiResult> {
  const requestId = generateRequestId();

  // Dynamically resolve runtime config if parameters are not explicitly passed
  const runtime = getGeminiRuntimeConfig();
  const cleanModel = (model || runtime.model || '').trim();
  const cleanKey = (apiKey || runtime.apiKey || '').trim();

  if (!cleanModel || !cleanKey) {
    return {
      ok: false,
      error: 'Penyedia AI belum dikonfigurasi. Pastikan GEMINI_API_KEY dan GEMINI_MODEL telah diatur di environment server.',
      status: 503,
      code: 'GEMINI_UNCONFIGURED',
      requestId,
    };
  }

  // Official endpoint without API key in query string
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent`;

  const requestBody = JSON.stringify({
    contents,
    ...(generationConfig ? { generationConfig } : {}),
  });

  let attempts = 0;

  while (attempts <= maxRetries) {
    attempts++;
    const isLastAttempt = attempts > maxRetries;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey,
        },
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-200 responses
      if (!response.ok) {
        const status = response.status;
        const errorText = await response.text().catch(() => '');

        let errorJson: { error?: { message?: string; status?: string; code?: number } } | null = null;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // ignore non-JSON body
        }

        const rawMsg = errorJson?.error?.message || response.statusText || '';

        // Safe server-side log with Request ID (never log API keys or secret URLs)
        console.error(`[GeminiProvider:${requestId}] HTTP ${status} (attempt ${attempts}/${maxRetries + 1}): ${rawMsg.slice(0, 150)}`);

        // Check if retryable: 429, 408, or 5xx
        const isRetryable = (status === 429 || status === 408 || status >= 500) && !isLastAttempt;

        if (isRetryable) {
          const backoff = attempts * 1500 + Math.floor(Math.random() * 500);
          console.warn(`[GeminiProvider:${requestId}] Retrying in ${backoff}ms after HTTP ${status}...`);
          await sleep(backoff);
          continue;
        }

        // Map status to safe Indonesian messages (No retry on 400/401/403/404 or exhausted retries)
        if (
          status === 401 ||
          status === 403 ||
          (status === 400 && isApiKeyInvalidMessage(rawMsg, errorText))
        ) {
          return {
            ok: false,
            error: 'API key Gemini ditolak. Periksa key dan akses project Google AI Studio.',
            status: 401,
            code: 'GEMINI_AUTH_REJECTED',
            requestId,
          };
        }

        if (status === 400) {
          return {
            ok: false,
            error: 'Permintaan ke AI tidak valid. Periksa parameter naskah.',
            status: 400,
            code: 'GEMINI_INVALID_REQUEST',
            requestId,
          };
        }

        if (status === 404) {
          return {
            ok: false,
            error: 'Model Gemini tidak tersedia untuk project ini.',
            status: 502,
            code: 'GEMINI_MODEL_NOT_FOUND',
            requestId,
          };
        }

        if (status === 429) {
          return {
            ok: false,
            error: 'Kuota Gemini sedang habis. Tunggu beberapa saat lalu coba lagi.',
            status: 429,
            code: 'GEMINI_RATE_LIMIT',
            requestId,
          };
        }

        if (status === 408 || status >= 500) {
          return {
            ok: false,
            error: 'Gangguan sementara pada layanan Gemini. Tunggu beberapa saat lalu coba lagi.',
            status: 502,
            code: 'GEMINI_SERVICE_UNAVAILABLE',
            requestId,
          };
        }

        // Generic fallback for any unexpected status
        return {
          ok: false,
          error: 'Penyedia AI mengembalikan kesalahan saat memproses permintaan.',
          status: 502,
          code: 'GEMINI_UNKNOWN_ERROR',
          requestId,
        };
      }

      // Successful HTTP response: parse body
      const data = await response.json();

      // Check prompt-level safety block
      if (data?.promptFeedback?.blockReason) {
        const blockReason = data.promptFeedback.blockReason;
        return {
          ok: false,
          error: `Naskah tidak dapat diproses karena dibatasi oleh filter keselamatan penyedia AI (${blockReason}).`,
          status: 422,
          code: 'GEMINI_SAFETY_BLOCK',
          requestId,
        };
      }

      const candidate = data?.candidates?.[0];

      // Check finish reason: SAFETY
      if (candidate?.finishReason === 'SAFETY') {
        return {
          ok: false,
          error: 'Naskah disaring oleh filter keselamatan penyedia AI (SAFETY).',
          status: 422,
          code: 'GEMINI_SAFETY_BLOCK',
          requestId,
        };
      }

      // Check finish reason: RECITATION
      if (candidate?.finishReason === 'RECITATION') {
        return {
          ok: false,
          error: 'Naskah dibatasi oleh filter hak cipta / kutipan penyedia AI (RECITATION).',
          status: 422,
          code: 'GEMINI_RECITATION_BLOCK',
          requestId,
        };
      }

      const rawResult = candidate?.content?.parts?.[0]?.text || '';

      if (!rawResult.trim()) {
        return {
          ok: false,
          error: 'Penyedia AI tidak menghasilkan teks untuk naskah ini. Coba sesuaikan instruksi atau teks input.',
          status: 502,
          code: 'GEMINI_EMPTY_RESPONSE',
          requestId,
        };
      }

      return {
        ok: true,
        text: rawResult.trim(),
        requestId,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      const isAbort = err instanceof Error && err.name === 'AbortError';
      const isNetwork = err instanceof TypeError || (err instanceof Error && err.message.includes('fetch'));

      console.error(`[GeminiProvider:${requestId}] Error during attempt ${attempts}:`, isAbort ? 'Timeout' : (err as Error).message);

      if ((isAbort || isNetwork) && !isLastAttempt) {
        const backoff = attempts * 1000;
        console.warn(`[GeminiProvider:${requestId}] Retrying after network/timeout in ${backoff}ms...`);
        await sleep(backoff);
        continue;
      }

      if (isAbort) {
        return {
          ok: false,
          error: 'Permintaan ke penyedia AI melebihi batas waktu (timeout). Silakan coba lagi.',
          status: 504,
          code: 'GEMINI_TIMEOUT',
          requestId,
        };
      }

      return {
        ok: false,
        error: 'Gangguan sementara pada layanan Gemini. Tunggu beberapa saat lalu coba lagi.',
        status: 502,
        code: 'GEMINI_NETWORK_ERROR',
        requestId,
      };
    }
  }

  return {
    ok: false,
    error: 'Gangguan sementara pada layanan Gemini. Tunggu beberapa saat lalu coba lagi.',
    status: 502,
    code: 'GEMINI_SERVICE_UNAVAILABLE',
    requestId,
  };
}
