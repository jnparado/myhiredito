import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";

export function getSupabaseClient() {
  return createSupabaseBrowserClient();
}

export { isSupabaseConfigured } from "./supabase/env";
export { createSupabaseBrowserClient } from "./supabase/client";
