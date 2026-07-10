import { createSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./env";
import type {
  EmployerOnboardingState,
  EmployerOnboardingStepId,
} from "../employerOnboarding";
import type {
  WorkerOnboardingState,
  OnboardingStepId,
} from "../workerOnboarding";

function mapWorkerRow(row: {
  completed_steps: string[];
  dismissed: boolean;
  personal: unknown;
  location_skills: unknown;
  payment: unknown;
}): WorkerOnboardingState {
  return {
    completedSteps: row.completed_steps as OnboardingStepId[],
    dismissed: row.dismissed,
    data: {
      personal: row.personal as WorkerOnboardingState["data"]["personal"],
      locationSkills: row.location_skills as WorkerOnboardingState["data"]["locationSkills"],
      payment: row.payment as WorkerOnboardingState["data"]["payment"],
    },
  };
}

function mapEmployerRow(row: {
  completed_steps: string[];
  dismissed: boolean;
  identity: unknown;
  business_certificate: unknown;
  business_details: unknown;
}): EmployerOnboardingState {
  return {
    completedSteps: row.completed_steps as EmployerOnboardingStepId[],
    dismissed: row.dismissed,
    data: {
      identity: row.identity as EmployerOnboardingState["data"]["identity"],
      businessCertificate:
        row.business_certificate as EmployerOnboardingState["data"]["businessCertificate"],
      businessDetails:
        row.business_details as EmployerOnboardingState["data"]["businessDetails"],
    },
  };
}

export async function fetchWorkerOnboardingFromDb(
  userId: string,
): Promise<WorkerOnboardingState | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("worker_onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapWorkerRow(data);
}

export async function saveWorkerOnboardingToDb(
  userId: string,
  state: WorkerOnboardingState,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("worker_onboarding").upsert({
    user_id: userId,
    completed_steps: state.completedSteps,
    dismissed: state.dismissed,
    personal: state.data.personal ?? null,
    location_skills: state.data.locationSkills ?? null,
    payment: state.data.payment ?? null,
  });

  return !error;
}

export async function fetchEmployerOnboardingFromDb(
  userId: string,
): Promise<EmployerOnboardingState | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("employer_onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapEmployerRow(data);
}

export async function saveEmployerOnboardingToDb(
  userId: string,
  state: EmployerOnboardingState,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("employer_onboarding").upsert({
    user_id: userId,
    completed_steps: state.completedSteps,
    dismissed: state.dismissed,
    identity: state.data.identity ?? null,
    business_certificate: state.data.businessCertificate ?? null,
    business_details: state.data.businessDetails ?? null,
  });

  return !error;
}

export async function resetWorkerOnboardingInDb(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseBrowserClient();
  await supabase.from("worker_onboarding").upsert({
    user_id: userId,
    completed_steps: [],
    dismissed: false,
    personal: null,
    location_skills: null,
    payment: null,
  });
}

export async function resetEmployerOnboardingInDb(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseBrowserClient();
  await supabase.from("employer_onboarding").upsert({
    user_id: userId,
    completed_steps: [],
    dismissed: false,
    identity: null,
    business_certificate: null,
    business_details: null,
  });
}
