import { createSupabaseBrowserClient } from "./client";
import type { Profile, UserRole } from "./database.types";
import { isSupabaseConfigured } from "./env";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function ensureProfileForUser({
  userId,
  email,
  role,
}: {
  userId: string;
  email: string;
  role: UserRole;
}): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: userId, role, email })
    .select("*")
    .single();

  if (error) return null;
  return data;
}

export function profileDisplayName(profile: Profile | null, email: string): string {
  if (!profile) return email.split("@")[0] ?? "User";
  const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return full || email.split("@")[0] || "User";
}
