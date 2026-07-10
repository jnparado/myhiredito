import { getSupabaseClient } from "./supabaseClient";
import {
  clearDemoWorkerSession,
  getDemoWorkerSession,
  type WorkerDemoUser,
} from "./workerDemoAuth";

export type WorkerAuthUser =
  | { source: "supabase"; email: string; displayName: string }
  | { source: "demo"; user: WorkerDemoUser };

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
    const email = data.session?.user?.email;
    if (email) {
      return {
        source: "supabase",
        email,
        displayName: displayNameFromEmail(email),
      };
    }
  } catch {
    // Supabase not configured or unavailable in this environment.
  }

  return null;
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
