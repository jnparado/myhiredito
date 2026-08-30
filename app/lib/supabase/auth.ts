import { createSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./env";
import { formatAuthError } from "../authErrors";
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
}: {
  email: string;
  password: string;
  role: UserRole;
  metadata?: Record<string, string>;
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
    },
  });

  if (result.error) {
    throw new Error(formatAuthError(result.error));
  }

  const existingUser =
    result.data.user &&
    !result.data.session &&
    (result.data.user.identities?.length ?? 0) === 0;
  if (existingUser) {
    throw new Error(
      "An account with this email already exists. Try logging in instead.",
    );
  }

  if (!result.data.session) {
    const signedIn = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (signedIn.error) {
      throw new Error(formatAuthError(signedIn.error));
    }
    result.data.session = signedIn.data.session;
    result.data.user = signedIn.data.user;
  }

  const userId = result.data.user?.id;
  if (!userId || !result.data.session) {
    throw new Error("Account created, but sign-in failed. Try logging in.");
  }

  await ensureProfileForUser({
    userId,
    email: normalizedEmail,
    role,
  });
  if (role === "worker") {
    await ensureWorkerOnboardingInDb(userId);
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

  if (error) {
    throw new Error(formatAuthError(error));
  }

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
