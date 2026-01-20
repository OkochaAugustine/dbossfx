import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.warn("Supabase env vars missing at runtime");
    return null;
  }

  supabaseClient = createClient(url, anon, {
    auth: { persistSession: true },
  });

  return supabaseClient;
}

