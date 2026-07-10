import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";
import { profileDisplayName, fetchProfile } from "./supabase/profiles";
import { signOutSupabase } from "./supabase/auth";
import type { Profile } from "./supabase/database.types";
import {
  clearDemoEmployerSession,
  getDemoEmployerSession,
  type EmployerDemoUser,
} from "./employerDemoAuth";

export type EmployerAuthUser =
  | {
      source: "supabase";
      id: string;
      email: string;
      displayName: string;
      profile: Profile | null;
    }
  | { source: "demo"; user: EmployerDemoUser };

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Employer";
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getEmployerAuthUser(): Promise<EmployerAuthUser | null> {
  const demo = getDemoEmployerSession();
  if (demo) return { source: "demo", user: demo };

  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    const email = user?.email;
    if (!user || !email) return null;

    const profile = await fetchProfile(user.id);
    if (profile && profile.role !== "employer") return null;

    return {
      source: "supabase",
      id: user.id,
      email,
      displayName: profileDisplayName(profile, email) || displayNameFromEmail(email),
      profile,
    };
  } catch {
    return null;
  }
}

export async function signOutEmployer(): Promise<void> {
  clearDemoEmployerSession();
  await signOutSupabase();
}

export function getEmployerDisplayName(user: EmployerAuthUser): string {
  return user.source === "demo" ? user.user.displayName : user.displayName;
}

export function getEmployerCompanyName(user: EmployerAuthUser): string {
  if (user.source === "demo") return user.user.companyName;
  return user.profile?.company_name || "Your business";
}

export function getEmployerUserId(user: EmployerAuthUser | null): string | null {
  if (!user) return null;
  return user.source === "supabase" ? user.id : null;
}
