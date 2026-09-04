import { createClient } from '@supabase/supabase-js';

// These values are intentionally public: Supabase publishes the project URL and
// publishable key to browser clients. Keeping safe fallbacks here also makes
// Cloudflare branch previews work when the build dashboard omits NEXT_PUBLIC_*.
const fallbackSupabaseUrl = 'https://mykgtajanxczdnzekycl.supabase.co';
const fallbackSupabasePublishableKey = 'sb_publishable_WOicVaI6VxFP0g4X0dJrlA_LX4hBCGI';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl;
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fallbackSupabasePublishableKey;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(
    supabasePublishableKey,
  );

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export function createAuthenticatedSupabaseClient(accessToken: string) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates a service-role Supabase client that bypasses RLS.
 * ONLY use this in server-side API routes for trusted operations.
 * NEVER expose the service role key to the client.
 */
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
