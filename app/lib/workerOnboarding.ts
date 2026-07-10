export type OnboardingStepId = "personal" | "location-skills" | "payment";

export type WorkerOnboardingData = {
  personal: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  locationSkills: {
    city: string;
    state: string;
    zip: string;
    skills: string[];
  };
  payment: {
    method: "bank" | "debit";
    accountLabel: string;
  };
};

export type WorkerOnboardingState = {
  completedSteps: OnboardingStepId[];
  dismissed: boolean;
  data: Partial<WorkerOnboardingData>;
};

const STORAGE_KEY = "myhiredito_worker_onboarding";
let syncUserId: string | null = null;

export function setWorkerOnboardingSyncUserId(userId: string | null) {
  syncUserId = userId;
}

export const ONBOARDING_STEPS: {
  id: OnboardingStepId;
  step: number;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "personal",
    step: 1,
    title: "Personal information",
    subtitle: "Name, phone, and contact details",
  },
  {
    id: "location-skills",
    step: 2,
    title: "Location & skill set",
    subtitle: "Where you work and what roles you want",
  },
  {
    id: "payment",
    step: 3,
    title: "Payment method",
    subtitle: "Add how you want to get paid",
  },
];

export const WORKER_SKILL_OPTIONS = [
  "Certified Nursing Assistant (CNA)",
  "Registered Nurse (RN)",
  "Licensed Practical Nurse (LPN)",
  "Home Health Aide",
  "Medical Assistant",
  "Warehouse Associate",
  "Food Service",
  "Event Staff",
] as const;

const defaultState: WorkerOnboardingState = {
  completedSteps: [],
  dismissed: false,
  data: {},
};

function dispatchOnboardingChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export function getWorkerOnboardingState(): WorkerOnboardingState {
  if (typeof window === "undefined") return defaultState;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveWorkerOnboardingState(state: WorkerOnboardingState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  dispatchOnboardingChange();

  if (syncUserId) {
    void import("./supabase/onboarding").then(({ saveWorkerOnboardingToDb }) =>
      saveWorkerOnboardingToDb(syncUserId!, state),
    );
  }
}

export function resetWorkerOnboardingState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  dispatchOnboardingChange();

  if (syncUserId) {
    void import("./supabase/onboarding").then(({ resetWorkerOnboardingInDb }) =>
      resetWorkerOnboardingInDb(syncUserId!),
    );
  }
}

export function isWorkerOnboardingComplete(
  state: WorkerOnboardingState = getWorkerOnboardingState(),
): boolean {
  return ONBOARDING_STEPS.every((step) =>
    state.completedSteps.includes(step.id),
  );
}

export function completeOnboardingStep(
  stepId: OnboardingStepId,
  data:
    | WorkerOnboardingData["personal"]
    | WorkerOnboardingData["locationSkills"]
    | WorkerOnboardingData["payment"],
): WorkerOnboardingState {
  const current = getWorkerOnboardingState();
  const completedSteps = current.completedSteps.includes(stepId)
    ? current.completedSteps
    : [...current.completedSteps, stepId];

  const dataKey =
    stepId === "location-skills" ? "locationSkills" : stepId;

  const next: WorkerOnboardingState = {
    ...current,
    completedSteps,
    dismissed: false,
    data: {
      ...current.data,
      [dataKey]: data,
    },
  };

  saveWorkerOnboardingState(next);
  return next;
}

export function dismissWorkerOnboarding(): WorkerOnboardingState {
  const current = getWorkerOnboardingState();
  const next = { ...current, dismissed: true };
  saveWorkerOnboardingState(next);
  return next;
}

export async function hydrateWorkerOnboardingFromDb(
  userId: string,
): Promise<WorkerOnboardingState | null> {
  const { fetchWorkerOnboardingFromDb } = await import("./supabase/onboarding");
  const remote = await fetchWorkerOnboardingFromDb(userId);
  if (!remote) return null;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    dispatchOnboardingChange();
  }
  return remote;
}

export function reopenWorkerOnboarding(): WorkerOnboardingState {
  const current = getWorkerOnboardingState();
  const next = { ...current, dismissed: false };
  saveWorkerOnboardingState(next);
  return next;
}
