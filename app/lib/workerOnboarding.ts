import type { WorkerAuthUser } from "./workerAuth";
import type { StripeBankDetails } from "./stripe/bank";
import {
  fetchOnboardingProgress,
  formDataToPaymentInput,
  formDataToProfileInput,
  formDataToSkillsCertificatesInput,
  markOnboardingStepCompleteInDb,
  savePaymentOnboarding,
  saveProfileOnboarding,
  saveSkillsCertificatesOnboarding,
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
    description: "Add your contact info and availability",
    icon: "👤",
    href: "/worker/onboarding/profile",
  },
  {
    id: "skills-certificates",
    step: 2,
    label: "Skills, experience & certificates",
    description: "Work history, skills, and professional credentials",
    icon: "📜",
    href: "/worker/onboarding/skills-certificates",
  },
  {
    id: "payment-method",
    step: 3,
    label: "Add payment method",
    description: "Connect a bank account with Stripe to receive pay after shifts",
    icon: "💳",
    href: "/worker/onboarding/payment",
  },
];

export function getWorkerUserKey(user: WorkerAuthUser | null): string | null {
  if (!user) return null;
  return user.source === "demo" ? user.user.email : user.id;
}

const STORAGE_PREFIX = "myhiredito_worker_onboarding_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function getOnboardingProgressLocal(userKey: string): OnboardingProgress {
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

function saveOnboardingProgressLocal(
  userKey: string,
  progress: OnboardingProgress,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(progress));
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

function markDemoStepComplete(
  userKey: string,
  stepId: OnboardingStepId,
): void {
  const current = getOnboardingProgressLocal(userKey);
  const completedSteps = current.completedSteps.includes(stepId)
    ? current.completedSteps
    : [...current.completedSteps, stepId];

  saveOnboardingProgressLocal(userKey, {
    ...current,
    completedSteps,
    dismissed: false,
  });
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

export async function dismissOnboarding(
  user: WorkerAuthUser,
  userKey: string,
): Promise<void> {
  const current = await getOnboardingProgress(user, userKey);
  if (user.source === "demo") {
    saveOnboardingProgressLocal(userKey, { ...current, dismissed: true });
    return;
  }
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
  const current = await getOnboardingProgress(user, userKey);
  if (user.source === "demo") {
    saveOnboardingProgressLocal(userKey, { ...current, dismissed: false });
    return;
  }
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
    markDemoStepComplete(userKey, stepId);
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
    markDemoStepComplete(userKey, stepId);
    return;
  }

  switch (stepId) {
    case "profile":
      await saveProfileOnboarding(userKey, formDataToProfileInput(formData));
      break;
    case "skills-certificates": {
      const input = formDataToSkillsCertificatesInput(formData);
      await saveSkillsCertificatesOnboarding(userKey, input);
      break;
    }
    case "payment-method":
      await savePaymentOnboarding(userKey, formDataToPaymentInput(formData));
      break;
    default:
      await markOnboardingStepComplete(user, userKey, stepId);
  }
}

export async function savePaymentFromStripeBank(
  user: WorkerAuthUser,
  userKey: string,
  bank: StripeBankDetails,
): Promise<void> {
  if (user.source === "demo") {
    markDemoStepComplete(userKey, "payment-method");
    return;
  }

  await savePaymentOnboarding(userKey, {
    paymentMethod: "bank-account",
    accountHolder: bank.accountHolder,
    accountLast4: bank.last4,
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
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
