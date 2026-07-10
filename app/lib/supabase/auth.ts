import { createSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./env";
import { ensureProfileForUser, fetchProfile } from "./profiles";
import type { UserRole } from "./database.types";
import { ensureWorkerOnboardingInDb } from "./workerOnboardingDb";

export function getAuthCallbackUrl(nextPath: string): string {
  if (typeof window === "undefined") return nextPath;
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

export async function signUpWithRole({
  email,
  password,
  role,
  metadata = {},
  nextPath,
}: {
  email: string;
  password: string;
  role: UserRole;
  metadata?: Record<string, string>;
  nextPath: string;
}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const supabase = createSupabaseBrowserClient();
  const result = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { role, ...metadata },
      emailRedirectTo: getAuthCallbackUrl(nextPath),
    },
  });

  if (result.error) throw result.error;

  if (result.data.user?.id) {
    if (result.data.session) {
      await ensureProfileForUser({
        userId: result.data.user.id,
        email: normalizedEmail,
        role,
      });
      if (role === "worker") {
        await ensureWorkerOnboardingInDb(result.data.user.id);
      }
    }
  }

  return result.data;
}

export async function signInWithRole({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: UserRole;
}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("Login failed. No user returned.");

  const profile = await fetchProfile(userId);
  const metadataRole = data.user?.user_metadata?.role as UserRole | undefined;

  if (profile && profile.role !== role) {
    await supabase.auth.signOut();
    throw new Error(
      role === "worker"
        ? "This account is registered as an employer. Use the employer login instead."
        : "This account is registered as a worker. Use the worker login instead.",
    );
  }

  if (!profile && metadataRole && metadataRole !== role) {
    await supabase.auth.signOut();
    throw new Error(
      role === "worker"
        ? "This account is registered as an employer. Use the employer login instead."
        : "This account is registered as a worker. Use the worker login instead.",
    );
  }

  if (!profile) {
    await ensureProfileForUser({ userId, email: normalizedEmail, role });
  }

  if (role === "worker") {
    try {
      await ensureWorkerOnboardingInDb(userId);
    } catch {
      // Trigger may have already created the row; don't block login.
    }
  }

  return data;
}

export async function signOutSupabase() {
  if (!isSupabaseConfigured()) return;
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
}
