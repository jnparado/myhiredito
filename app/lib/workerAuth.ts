import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";
import { fetchProfile as fetchWorkerProfile } from "./supabase/workerRepository";
import type { AvailabilityType, ProfileRow } from "./supabase/types";
import {
  clearDemoWorkerSession,
  getDemoWorkerSession,
  isWorkerDemoAccount,
  WORKER_DEMO_BIO,
  WORKER_DEMO_USER,
  type WorkerDemoUser,
} from "./workerDemoAuth";

export type WorkerAuthUser =
  | {
      source: "supabase";
      id: string;
      email: string;
      displayName: string;
      firstName?: string | null;
      lastName?: string | null;
      profile: ProfileRow | null;
    }
  | { source: "demo"; user: WorkerDemoUser };

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

function demoUserToProfile(user: WorkerDemoUser): ProfileRow {
  const now = new Date().toISOString();
  return {
    id: "demo-worker",
    role: "worker",
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    display_name: user.displayName,
    phone: user.phone,
    headline: user.headline,
    bio: WORKER_DEMO_BIO,
    location: user.location,
    skills: user.skills,
    seeking: ["CNA shifts", "Home health"],
    availability: user.availability as AvailabilityType,
    avatar_url: null,
    is_verified: true,
    last_active_at: now,
    created_at: now,
    updated_at: now,
  };
}

export async function getWorkerAuthUser(): Promise<WorkerAuthUser | null> {
  if (!isSupabaseConfigured()) {
    const demo = getDemoWorkerSession();
    if (demo) return { source: "demo", user: demo };
    return null;
  }

  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;

    const sessionUser = data.session?.user;
    const email = sessionUser?.email;
    if (sessionUser?.id && email) {
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
        source: "supabase",
        id: sessionUser.id,
        email,
        displayName: profileDisplayName(profile, email),
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        profile,
      };
    }
  } catch {
    // Fall through to demo session below.
  }

  const demo = getDemoWorkerSession();
  if (demo) return { source: "demo", user: demo };

  return null;
}

export async function signOutWorker(): Promise<void> {
  clearDemoWorkerSession();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore when Supabase is not configured.
    }
  }
  notifyWorkerAuthChange();
}

function isPlaceholderWorkerName(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return !normalized || normalized === "worker" || normalized === "demo worker";
}

export function getWorkerDisplayName(user: WorkerAuthUser): string {
  if (user.source === "demo") return user.user.displayName;
  if (isWorkerDemoAccount(user.email, user.displayName)) {
    if (!isPlaceholderWorkerName(user.displayName)) return user.displayName;
    return WORKER_DEMO_USER.displayName;
  }
  return user.displayName;
}

export function getWorkerEmail(user: WorkerAuthUser): string {
  return user.source === "demo" ? user.user.email : user.email;
}

function mergeDemoWorkerProfile(
  user: Extract<WorkerAuthUser, { source: "supabase" }>,
): ProfileRow {
  const profile = user.profile;
  const now = new Date().toISOString();
  return {
    id: user.id,
    role: "worker",
    email: user.email || WORKER_DEMO_USER.email,
    first_name: profile?.first_name || WORKER_DEMO_USER.firstName,
    last_name: profile?.last_name || WORKER_DEMO_USER.lastName,
    display_name: getWorkerDisplayName(user),
    phone: profile?.phone || WORKER_DEMO_USER.phone,
    headline: profile?.headline || WORKER_DEMO_USER.headline,
    bio: profile?.bio || WORKER_DEMO_BIO,
    location: profile?.location || WORKER_DEMO_USER.location,
    skills: profile?.skills?.length ? profile.skills : WORKER_DEMO_USER.skills,
    seeking: profile?.seeking?.length ? profile.seeking : ["CNA shifts", "Home health"],
    availability: profile?.availability || WORKER_DEMO_USER.availability,
    avatar_url: profile?.avatar_url ?? null,
    is_verified: true,
    last_active_at: profile?.last_active_at ?? now,
    created_at: profile?.created_at ?? now,
    updated_at: profile?.updated_at ?? now,
  };
}

export function getWorkerProfile(user: WorkerAuthUser): ProfileRow | null {
  if (user.source === "demo") return demoUserToProfile(user.user);
  if (isWorkerDemoAccount(user.email, user.displayName)) {
    return mergeDemoWorkerProfile(user);
  }
  return user.profile;
}

export function getWorkerId(user: WorkerAuthUser | null): string | null {
  if (!user) return null;
  return user.source === "supabase" ? user.id : null;
}

export function notifyWorkerAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
}
