import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The ONLY database object this app touches. It is written to exactly once, by
 * the single insert in /api/brochure-request — there are no reads, updates,
 * deletes or RPC calls anywhere in the codebase.
 *
 * This app uses the service_role key, which bypasses RLS — so the restriction is
 * enforced by the code above and nothing else. Keep SUPABASE_SERVICE_ROLE_KEY
 * server-only (never NEXT_PUBLIC_), and keep the insert in the API route the
 * single Supabase call in the codebase.
 */
export const LEADS_TABLE = "brochure_leads";

/**
 * Returns null when Supabase isn't configured, so callers can degrade instead of
 * throwing at module load (the site runs without Supabase in development).
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
