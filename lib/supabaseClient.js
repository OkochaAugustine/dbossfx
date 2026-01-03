// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

/**
 * Robust Supabase client setup:
 * - Works in dev & prod
 * - Works server-side (SSR) and client-side
 * - Supports anon key (public) and service role key (server-only)
 */

// Use server-side key if available
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    "Supabase URL is missing. Set SUPABASE_URL (server) or NEXT_PUBLIC_SUPABASE_URL (client)."
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase anon key is missing. Set NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Create client for public usage (browser & server-safe)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Optional: server-only client with full access
// Only import/use this in server code (API routes, getServerSideProps, etc.)
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;
