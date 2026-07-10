import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";
import { fetchProfile, profileDisplayName } from "./supabase/profiles";
import type { Profile } from "./supabase/database.types";

export type WorkerAuthUser = {
  id: string;
  email: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  profile: Profile | null;
};

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Worker";
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getWorkerAuthUser(): Promise<WorkerAuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    const sessionUser = data.user;
    const email = sessionUser?.email;
    if (!sessionUser?.id || !email) return null;

    let profile: Profile | null = null;
    try {
      profile = await fetchProfile(sessionUser.id);
    } catch {
      // Profile table may be unavailable; still allow session auth.
    }

    if (profile && profile.role !== "worker") return null;

    const displayName =
      profileDisplayName(profile, email) || displayNameFromEmail(email);

    return {
      id: sessionUser.id,
      email,
      displayName,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      profile,
    };
  } catch {
    return null;
  }
}

export async function signOutWorker(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore when Supabase is not configured.
  }
}

export function getWorkerDisplayName(user: WorkerAuthUser): string {
  return user.displayName;
}

export function getWorkerId(user: WorkerAuthUser | null): string | null {
  return user?.id ?? null;
}

export function notifyWorkerAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
}
