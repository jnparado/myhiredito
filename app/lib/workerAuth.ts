import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";
import { fetchProfile as fetchWorkerProfile } from "./supabase/workerRepository";
import type { ProfileRow } from "./supabase/types";

export type WorkerAuthUser = {
  id: string;
  email: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  profile: ProfileRow | null;
};

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Worker";
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function profileDisplayName(profile: ProfileRow | null, email: string): string {
  if (!profile) return displayNameFromEmail(email);
  const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return (
    profile.display_name?.trim() ||
    full ||
    displayNameFromEmail(email)
  );
}

export async function getWorkerAuthUser(): Promise<WorkerAuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;

    const sessionUser = data.session?.user;
    const email = sessionUser?.email;
    if (!sessionUser?.id || !email) return null;

    let profile: ProfileRow | null = null;
    try {
      profile = await fetchWorkerProfile(sessionUser.id);
    } catch {
      // Profile table may be unavailable; still allow session auth.
    }

    const metadataRole = sessionUser.user_metadata?.role as string | undefined;
    if (profile && profile.role !== "worker") return null;
    if (!profile && metadataRole && metadataRole !== "worker") return null;

    return {
      id: sessionUser.id,
      email,
      displayName: profileDisplayName(profile, email),
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
