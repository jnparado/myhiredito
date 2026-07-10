import type { WorkerAuthUser } from "./workerAuth";

export type OnboardingStepId = "profile" | "government-id" | "certificates";

export type OnboardingStep = {
  id: OnboardingStepId;
  step: number;
  label: string;
  description: string;
  icon: string;
  href: string;
};

export type OnboardingProgress = {
  completedSteps: OnboardingStepId[];
  dismissed: boolean;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "profile",
    step: 1,
    label: "Complete your profile",
    description: "Add your skills, work history, and availability",
    icon: "👤",
    href: "/worker/onboarding/profile",
  },
  {
    id: "government-id",
    step: 2,
    label: "Upload government ID",
    description: "Driver's license, passport, or national ID for verification",
    icon: "🪪",
    href: "/worker/onboarding/id",
  },
  {
    id: "certificates",
    step: 3,
    label: "Add certificates & licenses",
    description: "CNA, RN, BLS, or other role-specific credentials",
    icon: "📜",
    href: "/worker/onboarding/certificates",
  },
];

const STORAGE_PREFIX = "myhiredito_worker_onboarding_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

export function getWorkerUserKey(user: WorkerAuthUser | null): string | null {
  if (!user) return null;
  return user.source === "demo" ? user.user.email : user.email;
}

export function getDefaultOnboardingProgress(): OnboardingProgress {
  return { completedSteps: [], dismissed: false };
}

export function getOnboardingProgress(userKey: string): OnboardingProgress {
  if (typeof window === "undefined") return getDefaultOnboardingProgress();

  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return getDefaultOnboardingProgress();

  try {
    const parsed = JSON.parse(raw) as OnboardingProgress;
    return {
      completedSteps: parsed.completedSteps ?? [],
      dismissed: parsed.dismissed ?? false,
    };
  } catch {
    return getDefaultOnboardingProgress();
  }
}

function saveOnboardingProgress(
  userKey: string,
  progress: OnboardingProgress,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(progress));
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export function resetWorkerOnboarding(userKey: string): void {
  saveOnboardingProgress(userKey, getDefaultOnboardingProgress());
}

export function dismissOnboarding(userKey: string): void {
  const progress = getOnboardingProgress(userKey);
  saveOnboardingProgress(userKey, { ...progress, dismissed: true });
}

export function resumeOnboarding(userKey: string): void {
  const progress = getOnboardingProgress(userKey);
  saveOnboardingProgress(userKey, { ...progress, dismissed: false });
}

export function markOnboardingStepComplete(
  userKey: string,
  stepId: OnboardingStepId,
): void {
  const progress = getOnboardingProgress(userKey);
  if (progress.completedSteps.includes(stepId)) return;

  saveOnboardingProgress(userKey, {
    ...progress,
    completedSteps: [...progress.completedSteps, stepId],
  });
}

export function isOnboardingComplete(progress: OnboardingProgress): boolean {
  return ONBOARDING_STEPS.every((step) =>
    progress.completedSteps.includes(step.id),
  );
}

export function getIncompleteOnboardingSteps(
  progress: OnboardingProgress,
): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(
    (step) => !progress.completedSteps.includes(step.id),
  );
}

export function getOnboardingCompletionCount(progress: OnboardingProgress): {
  completed: number;
  total: number;
} {
  return {
    completed: progress.completedSteps.length,
    total: ONBOARDING_STEPS.length,
  };
}
