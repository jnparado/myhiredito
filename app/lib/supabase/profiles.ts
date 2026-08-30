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

  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const supabase = createSupabaseBrowserClient();
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        role,
        email: normalizedEmail,
        display_name: normalizedEmail.split("@")[0],
      } as Record<string, unknown>,
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) {
    return fetchProfile(userId);
  }

  return data;
}

export function profileDisplayName(profile: Profile | null, email: string): string {
  if (!profile) return email.split("@")[0] ?? "User";
  const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return full || email.split("@")[0] || "User";
}
