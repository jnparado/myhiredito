import type { SupabaseClient } from "@supabase/supabase-js";
import { WORKER_DEMO_ONBOARDING_STEPS } from "../demoAccounts";
import { EMPLOYER_DEMO_ONBOARDING, EMPLOYER_DEMO_USER } from "../employerDemoAuth";
import { WORKER_DEMO_USER } from "../workerDemoAuth";
import type { UserRole } from "./database.types";

export async function seedDemoUserData(
  supabase: SupabaseClient,
  role: UserRole,
  userId: string,
): Promise<void> {
  if (role === "employer") {
    await upsertProfile(supabase, {
      id: userId,
      role: "employer",
      email: EMPLOYER_DEMO_USER.email,
      first_name: EMPLOYER_DEMO_USER.firstName,
      last_name: EMPLOYER_DEMO_USER.lastName,
      display_name: EMPLOYER_DEMO_USER.displayName,
      company_name: EMPLOYER_DEMO_USER.companyName,
    });

    const { error: onboardingError } = await supabase.from("employer_onboarding").upsert({
      user_id: userId,
      completed_steps: [...EMPLOYER_DEMO_ONBOARDING.completedSteps],
      dismissed: EMPLOYER_DEMO_ONBOARDING.dismissed,
      identity: EMPLOYER_DEMO_ONBOARDING.data.identity,
      business_certificate: EMPLOYER_DEMO_ONBOARDING.data.businessCertificate,
      business_details: EMPLOYER_DEMO_ONBOARDING.data.businessDetails,
    });
    if (onboardingError) {
      // Older projects may not have employer_onboarding yet.
    }
    return;
  }

  await upsertProfile(supabase, {
    id: userId,
    role: "worker",
    email: WORKER_DEMO_USER.email,
    first_name: WORKER_DEMO_USER.firstName,
    last_name: WORKER_DEMO_USER.lastName,
    display_name: WORKER_DEMO_USER.displayName,
    phone: WORKER_DEMO_USER.phone,
    location: WORKER_DEMO_USER.location,
    headline: WORKER_DEMO_USER.headline,
    skills: WORKER_DEMO_USER.skills,
    availability: WORKER_DEMO_USER.availability,
    is_verified: true,
  });

  await supabase.from("onboarding_progress").upsert({
    worker_id: userId,
    completed_steps: [...WORKER_DEMO_ONBOARDING_STEPS],
    dismissed: false,
  });

  await supabase.from("worker_onboarding").upsert({
    user_id: userId,
    completed_steps: [...WORKER_DEMO_ONBOARDING_STEPS],
    dismissed: false,
  });
}

async function upsertProfile(
  supabase: SupabaseClient,
  row: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "id" });
  if (!error) return;

  await supabase.from("profiles").upsert(
    {
      id: row.id,
      role: row.role,
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      display_name: row.display_name ?? null,
    },
    { onConflict: "id" },
  );
}
