import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

let cached: SupabaseClient | null = null;

/** Browser Supabase client (use in client components and form handlers). */
export function getSupabaseClient(): SupabaseClient {
  if (cached) return cached;
  cached = createClient();
  return cached;
}
