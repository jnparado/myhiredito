import { createSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./env";
import type { OnboardingStepId } from "./types";

export type WorkerOnboardingRow = {
  user_id: string;
  completed_steps: OnboardingStepId[];
  dismissed: boolean;
  personal: Record<string, unknown> | null;
  location_skills: Record<string, unknown> | null;
  payment: Record<string, unknown> | null;
  updated_at: string;
};

function normalizeCompletedSteps(steps: string[]): OnboardingStepId[] {
  return steps.map((step) => {
    if (step === "government-id") return "skills-certificates";
    if (step === "certificates") return "payment-method";
    return step as OnboardingStepId;
  });
}

export async function fetchWorkerOnboardingFromDb(
  userId: string,
): Promise<WorkerOnboardingRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("worker_onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    completed_steps: normalizeCompletedSteps(data.completed_steps ?? []),
    personal: (data.personal as Record<string, unknown> | null) ?? null,
    location_skills:
      (data.location_skills as Record<string, unknown> | null) ?? null,
    payment: (data.payment as Record<string, unknown> | null) ?? null,
  };
}

export async function ensureWorkerOnboardingInDb(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("worker_onboarding").upsert(
    {
      user_id: userId,
      completed_steps: [],
      dismissed: false,
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}

export async function saveWorkerOnboardingToDb(
  userId: string,
  updates: Partial<
    Pick<
      WorkerOnboardingRow,
      | "completed_steps"
      | "dismissed"
      | "personal"
      | "location_skills"
      | "payment"
    >
  >,
): Promise<WorkerOnboardingRow> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const current = await fetchWorkerOnboardingFromDb(userId);
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("worker_onboarding")
    .upsert(
      {
        user_id: userId,
        completed_steps:
          updates.completed_steps ?? current?.completed_steps ?? [],
        dismissed: updates.dismissed ?? current?.dismissed ?? false,
        personal: updates.personal ?? current?.personal ?? null,
        location_skills:
          updates.location_skills ?? current?.location_skills ?? null,
        payment: updates.payment ?? current?.payment ?? null,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) throw error;

  return {
    ...data,
    completed_steps: normalizeCompletedSteps(data.completed_steps ?? []),
    personal: (data.personal as Record<string, unknown> | null) ?? null,
    location_skills:
      (data.location_skills as Record<string, unknown> | null) ?? null,
    payment: (data.payment as Record<string, unknown> | null) ?? null,
  };
}

export async function markWorkerOnboardingStepCompleteInDb(
  userId: string,
  stepId: OnboardingStepId,
): Promise<WorkerOnboardingRow> {
  const current = await fetchWorkerOnboardingFromDb(userId);
  const completed = current?.completed_steps ?? [];

  if (completed.includes(stepId)) {
    return (
      current ??
      (await saveWorkerOnboardingToDb(userId, { completed_steps: completed }))
    );
  }

  return saveWorkerOnboardingToDb(userId, {
    completed_steps: [...completed, stepId],
    dismissed: current?.dismissed ?? false,
    personal: current?.personal ?? null,
    location_skills: current?.location_skills ?? null,
    payment: current?.payment ?? null,
  });
}
