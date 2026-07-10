import { getSupabaseClient } from "./supabaseClient";
import {
  clearDemoWorkerSession,
  getDemoWorkerSession,
  type WorkerDemoUser,
} from "./workerDemoAuth";
import { fetchProfile } from "./supabase/workerRepository";

export type WorkerAuthUser =
  | { source: "demo"; user: WorkerDemoUser }
  | {
      source: "supabase";
      id: string;
      email: string;
      displayName: string;
      firstName?: string | null;
      lastName?: string | null;
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
  const demo = getDemoWorkerSession();
  if (demo) return { source: "demo", user: demo };

  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;
    const email = sessionUser?.email;
    if (!sessionUser?.id || !email) return null;

    let profile = null;
    try {
      profile = await fetchProfile(sessionUser.id);
    } catch {
      // Profile table may be unavailable; still allow session auth.
    }

    const displayName =
      profile?.display_name?.trim() ||
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
      displayNameFromEmail(email);

    return {
      source: "supabase",
      id: sessionUser.id,
      email,
      displayName,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
    };
  } catch {
    return null;
  }
}

export async function signOutWorker(): Promise<void> {
  clearDemoWorkerSession();
  try {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore when Supabase is not configured.
  }
}

export function getWorkerDisplayName(user: WorkerAuthUser): string {
  return user.source === "demo" ? user.user.displayName : user.displayName;
}

export function getWorkerId(user: WorkerAuthUser | null): string | null {
  if (!user) return null;
  return user.source === "supabase" ? user.id : null;
}

export function notifyWorkerAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
}
