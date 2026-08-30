import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";
import { fetchProfile, profileDisplayName } from "./supabase/profiles";
import { fetchProfile as fetchWorkerProfile } from "./supabase/workerRepository";
import type { ProfileRow } from "./supabase/types";
import type { UserRole } from "./supabase/database.types";
import {
  getDemoEmployerSession,
  type EmployerDemoUser,
} from "./employerDemoAuth";
import type { EmployerAuthUser } from "./employerAuth";
import {
  getDemoWorkerSession,
  type WorkerDemoUser,
} from "./workerDemoAuth";
import type { WorkerAuthUser } from "./workerAuth";

export type ResolvedAppAuth = {
  worker: WorkerAuthUser | null;
  employer: EmployerAuthUser | null;
};

const WORKER_AUTH_ROUTES = new Set(["/worker/login", "/worker/signup"]);
const EMPLOYER_AUTH_ROUTES = new Set(["/employer/login", "/employer/signup"]);

export function isWorkerAuthRoute(pathname: string | null): boolean {
  return pathname != null && WORKER_AUTH_ROUTES.has(pathname);
}

export function isEmployerAuthRoute(pathname: string | null): boolean {
  return pathname != null && EMPLOYER_AUTH_ROUTES.has(pathname);
}

export function isWorkerMarketingContext(pathname: string | null): boolean {
  if (!pathname) return false;
  if (isWorkerAuthRoute(pathname)) return true;
  return pathname === "/worker" || pathname.startsWith("/worker/jobs");
}

export function isEmployerMarketingContext(pathname: string | null): boolean {
  if (!pathname) return false;
  if (isEmployerAuthRoute(pathname)) return true;
  if (pathname === "/" || pathname === "/employer") return true;
  return pathname.startsWith("/employer") && !pathname.startsWith("/employer/dashboard");
}

function displayNameFromEmail(email: string, fallback: string): string {
  const local = email.split("@")[0] ?? fallback;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function workerProfileDisplayName(profile: ProfileRow | null, email: string): string {
  if (!profile) return displayNameFromEmail(email, "Worker");
  const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return profile.display_name?.trim() || full || displayNameFromEmail(email, "Worker");
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
    bio: null,
    location: user.location,
    skills: user.skills,
    seeking: ["CNA shifts", "Home health"],
    availability: user.availability as ProfileRow["availability"],
    avatar_url: null,
    is_verified: true,
    last_active_at: now,
    created_at: now,
    updated_at: now,
  };
}

function resolveRole(
  profileRole: UserRole | undefined,
  metadataRole: UserRole | undefined,
): UserRole | null {
  if (profileRole === "worker" || profileRole === "employer") return profileRole;
  if (metadataRole === "worker" || metadataRole === "employer") return metadataRole;
  return null;
}

function buildWorkerFromSupabase(
  sessionUser: User,
  profile: ProfileRow | null,
): WorkerAuthUser {
  const email = sessionUser.email ?? "";
  return {
    source: "supabase",
    id: sessionUser.id,
    email,
    displayName: workerProfileDisplayName(profile, email),
    firstName: profile?.first_name,
    lastName: profile?.last_name,
    profile,
  };
}

function buildEmployerFromSupabase(
  sessionUser: User,
  profile: Awaited<ReturnType<typeof fetchProfile>>,
): EmployerAuthUser {
  const email = sessionUser.email ?? "";
  return {
    source: "supabase",
    id: sessionUser.id,
    email,
    displayName:
      profileDisplayName(profile, email) || displayNameFromEmail(email, "Employer"),
    profile,
  };
}

function buildDemoAuthState(): ResolvedAppAuth {
  const workerDemo = getDemoWorkerSession();
  const employerDemo = getDemoEmployerSession();
  return {
    worker: workerDemo ? { source: "demo", user: workerDemo } : null,
    employer: employerDemo ? { source: "demo", user: employerDemo } : null,
  };
}

export async function resolveAppAuthState(): Promise<ResolvedAppAuth> {
  if (!isSupabaseConfigured()) {
    return buildDemoAuthState();
  }

  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return buildDemoAuthState();

    const sessionUser = data.session?.user;
    const email = sessionUser?.email;

    if (sessionUser?.id && email) {
      const metadataRole = sessionUser.user_metadata?.role as UserRole | undefined;

      if (metadataRole === "employer") {
        const employerProfile = await fetchProfile(sessionUser.id);
        return {
          worker: null,
          employer: buildEmployerFromSupabase(sessionUser, employerProfile),
        };
      }

      if (metadataRole === "worker") {
        let workerProfile: ProfileRow | null = null;
        try {
          workerProfile = await fetchWorkerProfile(sessionUser.id);
        } catch {
          workerProfile = null;
        }
        return {
          worker: buildWorkerFromSupabase(sessionUser, workerProfile),
          employer: null,
        };
      }

      let workerProfile: ProfileRow | null = null;
      try {
        workerProfile = await fetchWorkerProfile(sessionUser.id);
      } catch {
        workerProfile = null;
      }

      const employerProfile = workerProfile
        ? {
            id: workerProfile.id,
            role: workerProfile.role as UserRole,
            email: workerProfile.email,
            first_name: workerProfile.first_name,
            last_name: workerProfile.last_name,
            display_name: workerProfile.display_name,
            company_name: null,
            avatar_url: workerProfile.avatar_url,
            created_at: workerProfile.created_at,
            updated_at: workerProfile.updated_at,
          }
        : await fetchProfile(sessionUser.id);

      const profileRole = (workerProfile?.role ?? employerProfile?.role) as
        | UserRole
        | undefined;
      const role = resolveRole(profileRole, metadataRole);

      if (role === "worker") {
        return {
          worker: buildWorkerFromSupabase(sessionUser, workerProfile),
          employer: null,
        };
      }

      if (role === "employer") {
        return {
          worker: null,
          employer: buildEmployerFromSupabase(sessionUser, employerProfile),
        };
      }

      return { worker: null, employer: null };
    }
  } catch {
    // Fall through to demo sessions.
  }

  return buildDemoAuthState();
}

let cachedAuth: ResolvedAppAuth | undefined;
let inflightRefresh: Promise<ResolvedAppAuth> | null = null;
let signedOutLock: { worker: boolean; employer: boolean } = {
  worker: false,
  employer: false,
};
const authListeners = new Set<(state: ResolvedAppAuth) => void>();

function withSignedOutLocks(state: ResolvedAppAuth): ResolvedAppAuth {
  return {
    worker: signedOutLock.worker ? null : state.worker,
    employer: signedOutLock.employer ? null : state.employer,
  };
}

export function getCachedAppAuthState(): ResolvedAppAuth | undefined {
  return cachedAuth;
}

export function subscribeAppAuthState(
  listener: (state: ResolvedAppAuth) => void,
): () => void {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function authIdentity(
  user: ResolvedAppAuth["worker"] | ResolvedAppAuth["employer"],
): string {
  if (!user) return "";
  if (user.source === "demo") return `demo:${user.user.email}`;
  return `supabase:${user.id}`;
}

function authStateKey(state: ResolvedAppAuth): string {
  return `${authIdentity(state.worker)}|${authIdentity(state.employer)}`;
}

function notifyAuthListeners(state: ResolvedAppAuth): void {
  authListeners.forEach((listener) => listener(state));
}

export function applySignedOutRole(role: "worker" | "employer"): ResolvedAppAuth {
  signedOutLock[role] = true;
  const current = cachedAuth ?? { worker: null, employer: null };
  cachedAuth =
    role === "worker"
      ? { worker: null, employer: current.employer }
      : { worker: current.worker, employer: null };
  inflightRefresh = null;
  notifyAuthListeners(cachedAuth);
  return cachedAuth;
}

export function markRoleSignedIn(role: "worker" | "employer"): void {
  signedOutLock[role] = false;
}

export async function refreshAppAuthState(options?: {
  force?: boolean;
}): Promise<ResolvedAppAuth> {
  if (inflightRefresh && !options?.force) return inflightRefresh;

  const previousKey = cachedAuth ? authStateKey(cachedAuth) : null;

  inflightRefresh = resolveAppAuthState()
    .then((state) => {
      const next = withSignedOutLocks(state);
      const changed =
        options?.force || !previousKey || previousKey !== authStateKey(next);
      cachedAuth = next;
      inflightRefresh = null;
      if (changed) notifyAuthListeners(next);
      return next;
    })
    .catch((error) => {
      inflightRefresh = null;
      throw error;
    });

  return inflightRefresh;
}

export function clearCachedAppAuthState(): void {
  cachedAuth = undefined;
}

export { demoUserToProfile };
