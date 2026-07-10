import type { WorkerAuthUser } from "./workerAuth";
import {
  fetchOnboardingProgress,
  formDataToCertificateInput,
  formDataToIdentityInput,
  formDataToProfileInput,
  markOnboardingStepCompleteInDb,
  saveCertificateOnboarding,
  saveIdentityOnboarding,
  saveProfileOnboarding,
  updateOnboardingProgressRow,
} from "./supabase/workerRepository";
import type { OnboardingStepId as DbOnboardingStepId } from "./supabase/types";

export type OnboardingStepId = DbOnboardingStepId;

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
  return user.source === "demo" ? user.user.email : user.id;
}

export function getDefaultOnboardingProgress(): OnboardingProgress {
  return { completedSteps: [], dismissed: false };
}

function rowToProgress(row: {
  completed_steps: OnboardingStepId[];
  dismissed: boolean;
}): OnboardingProgress {
  return {
    completedSteps: row.completed_steps ?? [],
    dismissed: row.dismissed ?? false,
  };
}

export function getOnboardingProgressLocal(userKey: string): OnboardingProgress {
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

export async function getOnboardingProgress(
  user: WorkerAuthUser,
  userKey: string,
): Promise<OnboardingProgress> {
  if (user.source === "demo") {
    return getOnboardingProgressLocal(userKey);
  }

  const row = await fetchOnboardingProgress(userKey);
  if (!row) return getDefaultOnboardingProgress();
  return rowToProgress(row);
}

function saveOnboardingProgressLocal(
  userKey: string,
  progress: OnboardingProgress,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(progress));
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export function resetWorkerOnboarding(userKey: string): void {
  saveOnboardingProgressLocal(userKey, getDefaultOnboardingProgress());
}

export async function dismissOnboarding(
  user: WorkerAuthUser,
  userKey: string,
): Promise<void> {
  if (user.source === "demo") {
    const progress = getOnboardingProgressLocal(userKey);
    saveOnboardingProgressLocal(userKey, { ...progress, dismissed: true });
    return;
  }

  const current = await getOnboardingProgress(user, userKey);
  await updateOnboardingProgressRow(userKey, {
    completed_steps: current.completedSteps,
    dismissed: true,
  });
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export async function resumeOnboarding(
  user: WorkerAuthUser,
  userKey: string,
): Promise<void> {
  if (user.source === "demo") {
    const progress = getOnboardingProgressLocal(userKey);
    saveOnboardingProgressLocal(userKey, { ...progress, dismissed: false });
    return;
  }

  const current = await getOnboardingProgress(user, userKey);
  await updateOnboardingProgressRow(userKey, {
    completed_steps: current.completedSteps,
    dismissed: false,
  });
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export async function markOnboardingStepComplete(
  user: WorkerAuthUser,
  userKey: string,
  stepId: OnboardingStepId,
): Promise<void> {
  if (user.source === "demo") {
    const progress = getOnboardingProgressLocal(userKey);
    if (progress.completedSteps.includes(stepId)) return;
    saveOnboardingProgressLocal(userKey, {
      ...progress,
      completedSteps: [...progress.completedSteps, stepId],
    });
    return;
  }

  await markOnboardingStepCompleteInDb(userKey, stepId);
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export async function saveOnboardingStep(
  user: WorkerAuthUser,
  userKey: string,
  stepId: OnboardingStepId,
  formData: FormData,
): Promise<void> {
  if (user.source === "demo") {
    await markOnboardingStepComplete(user, userKey, stepId);
    return;
  }

  switch (stepId) {
    case "profile":
      await saveProfileOnboarding(userKey, formDataToProfileInput(formData));
      break;
    case "government-id": {
      const input = formDataToIdentityInput(formData);
      if (!input.idFront) {
        throw new Error("Please upload the front of your ID.");
      }
      await saveIdentityOnboarding(userKey, input);
      break;
    }
    case "certificates": {
      const input = formDataToCertificateInput(formData);
      if (!input.certificateFile) {
        throw new Error("Please upload your certificate file.");
      }
      await saveCertificateOnboarding(userKey, input);
      break;
    }
    default:
      await markOnboardingStepComplete(user, userKey, stepId);
  }
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
