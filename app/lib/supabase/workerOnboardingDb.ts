import { createSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./env";
import type { OnboardingStepId } from "./types";

export type WorkerOnboardingRow = {
  worker_id: string;
  completed_steps: OnboardingStepId[];
  dismissed: boolean;
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
  workerId: string,
): Promise<WorkerOnboardingRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("onboarding_progress")
    .select("*")
    .eq("worker_id", workerId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    worker_id: data.worker_id,
    completed_steps: normalizeCompletedSteps(data.completed_steps ?? []),
    dismissed: data.dismissed ?? false,
    updated_at: data.updated_at,
  };
}

export async function ensureWorkerOnboardingInDb(workerId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("onboarding_progress").upsert(
    {
      worker_id: workerId,
      completed_steps: [],
      dismissed: false,
    },
    { onConflict: "worker_id" },
  );

  if (error) throw error;
}

export async function saveWorkerOnboardingToDb(
  workerId: string,
  updates: Partial<Pick<WorkerOnboardingRow, "completed_steps" | "dismissed">>,
): Promise<WorkerOnboardingRow> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const current = await fetchWorkerOnboardingFromDb(workerId);
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("onboarding_progress")
    .upsert(
      {
        worker_id: workerId,
        completed_steps:
          updates.completed_steps ?? current?.completed_steps ?? [],
        dismissed: updates.dismissed ?? current?.dismissed ?? false,
      },
      { onConflict: "worker_id" },
    )
    .select("*")
    .single();

  if (error) throw error;

  return {
    worker_id: data.worker_id,
    completed_steps: normalizeCompletedSteps(data.completed_steps ?? []),
    dismissed: data.dismissed ?? false,
    updated_at: data.updated_at,
  };
}

export async function markWorkerOnboardingStepCompleteInDb(
  workerId: string,
  stepId: OnboardingStepId,
): Promise<WorkerOnboardingRow> {
  const current = await fetchWorkerOnboardingFromDb(workerId);
  const completed = current?.completed_steps ?? [];

  if (completed.includes(stepId)) {
    return (
      current ??
      (await saveWorkerOnboardingToDb(workerId, { completed_steps: completed }))
    );
  }

  return saveWorkerOnboardingToDb(workerId, {
    completed_steps: [...completed, stepId],
    dismissed: current?.dismissed ?? false,
  });
}
