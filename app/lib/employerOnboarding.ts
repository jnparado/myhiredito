import type { EmployerAuthUser } from "./employerAuth";

export type EmployerOnboardingStepId =
  | "identity"
  | "business-certificate"
  | "business-details";

export type EmployerOnboardingData = {
  identity: {
    legalName: string;
    idType: string;
    idNumber: string;
    dateOfBirth: string;
    idDocumentLabel: string;
  };
  businessCertificate: {
    legalBusinessName: string;
    businessType: string;
    registrationNumber: string;
    taxId: string;
    yearEstablished: string;
    certificateLabel: string;
  };
  businessDetails: {
    address: string;
    city: string;
    state: string;
    zip: string;
    industry: string;
    contactPhone: string;
    website: string;
    hiringRoles: string[];
    locationsCount: string;
    notes: string;
  };
};

export type OnboardingProgress = {
  completedSteps: EmployerOnboardingStepId[];
  dismissed: boolean;
  data: Partial<EmployerOnboardingData>;
};

export type OnboardingStep = {
  id: EmployerOnboardingStepId;
  step: number;
  label: string;
  description: string;
  icon: string;
  href: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "identity",
    step: 1,
    label: "Government ID",
    description: "Verify the authorized representative with a valid ID",
    icon: "🪪",
    href: "/employer/onboarding/id",
  },
  {
    id: "business-certificate",
    step: 2,
    label: "Business certificate",
    description: "Legal entity registration, tax ID, and certificate proof",
    icon: "📄",
    href: "/employer/onboarding/business-certificate",
  },
  {
    id: "business-details",
    step: 3,
    label: "Business details",
    description: "Locations, industry, hiring needs, and contact info",
    icon: "🏢",
    href: "/employer/onboarding/business-details",
  },
];

export const EMPLOYER_ID_TYPES = [
  "Driver's license",
  "Passport",
  "National ID",
  "State-issued ID",
] as const;

export const EMPLOYER_BUSINESS_TYPES = [
  "LLC",
  "Corporation",
  "Partnership",
  "Sole proprietorship",
  "Non-profit",
  "Government agency",
] as const;

export const EMPLOYER_INDUSTRY_OPTIONS = [
  "Healthcare",
  "Hospitality",
  "Logistics & warehousing",
  "Retail",
  "Events & venues",
  "Manufacturing",
  "Professional services",
] as const;

export const EMPLOYER_HIRING_ROLE_OPTIONS = [
  "Certified Nursing Assistant (CNA)",
  "Registered Nurse (RN)",
  "Licensed Practical Nurse (LPN)",
  "Home Health Aide",
  "Warehouse Associate",
  "Food Service",
  "Event Staff",
  "Administrative",
] as const;

const STORAGE_PREFIX = "myhiredito_employer_onboarding_";
let syncUserId: string | null = null;

export function setEmployerOnboardingSyncUserId(userId: string | null) {
  syncUserId = userId;
}

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

export function getEmployerUserKey(user: EmployerAuthUser | null): string | null {
  if (!user) return null;
  return user.source === "demo" ? user.user.email : user.id;
}

export function getDefaultOnboardingProgress(): OnboardingProgress {
  return { completedSteps: [], dismissed: false, data: {} };
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
      data: parsed.data ?? {},
    };
  } catch {
    return getDefaultOnboardingProgress();
  }
}

function dispatchOnboardingChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-onboarding"));
}

function saveOnboardingProgressLocal(
  userKey: string,
  progress: OnboardingProgress,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(progress));
  dispatchOnboardingChange();

  if (syncUserId) {
    void import("./supabase/onboarding").then(({ saveEmployerOnboardingToDb }) =>
      saveEmployerOnboardingToDb(syncUserId!, {
        completedSteps: progress.completedSteps,
        dismissed: progress.dismissed,
        data: progress.data,
      }),
    );
  }
}

export async function getOnboardingProgress(
  user: EmployerAuthUser,
  userKey: string,
): Promise<OnboardingProgress> {
  if (user.source === "demo") {
    return getOnboardingProgressLocal(userKey);
  }

  const { fetchEmployerOnboardingFromDb } = await import("./supabase/onboarding");
  const remote = await fetchEmployerOnboardingFromDb(userKey);
  if (!remote) return getDefaultOnboardingProgress();
  return {
    completedSteps: remote.completedSteps,
    dismissed: remote.dismissed,
    data: remote.data,
  };
}

export function resetEmployerOnboarding(userKey: string): void {
  saveOnboardingProgressLocal(userKey, getDefaultOnboardingProgress());
}

export function isOnboardingComplete(
  progress: OnboardingProgress = getDefaultOnboardingProgress(),
): boolean {
  return ONBOARDING_STEPS.every((step) =>
    progress.completedSteps.includes(step.id),
  );
}

export function getOnboardingCompletionCount(progress: OnboardingProgress) {
  return {
    completed: progress.completedSteps.length,
    total: ONBOARDING_STEPS.length,
  };
}

export function getIncompleteOnboardingSteps(progress: OnboardingProgress) {
  return ONBOARDING_STEPS.filter(
    (step) => !progress.completedSteps.includes(step.id),
  );
}

export async function dismissOnboarding(
  user: EmployerAuthUser,
  userKey: string,
): Promise<void> {
  const progress = await getOnboardingProgress(user, userKey);
  saveOnboardingProgressLocal(userKey, { ...progress, dismissed: true });
}

export async function resumeOnboarding(
  user: EmployerAuthUser,
  userKey: string,
): Promise<void> {
  const progress = await getOnboardingProgress(user, userKey);
  saveOnboardingProgressLocal(userKey, { ...progress, dismissed: false });
}

async function markStepComplete(
  user: EmployerAuthUser,
  userKey: string,
  stepId: EmployerOnboardingStepId,
  data: Partial<EmployerOnboardingData>,
): Promise<void> {
  const progress = await getOnboardingProgress(user, userKey);
  const completedSteps = progress.completedSteps.includes(stepId)
    ? progress.completedSteps
    : [...progress.completedSteps, stepId];

  saveOnboardingProgressLocal(userKey, {
    completedSteps,
    dismissed: false,
    data: { ...progress.data, ...data },
  });
}

function formValue(value: FormDataEntryValue | null): string {
  if (value instanceof File) return value.name;
  return String(value ?? "");
}

export async function saveOnboardingStep(
  user: EmployerAuthUser,
  userKey: string,
  stepId: EmployerOnboardingStepId,
  formData: FormData,
): Promise<void> {
  if (stepId === "identity") {
    await markStepComplete(user, userKey, stepId, {
      identity: {
        legalName: formValue(formData.get("legalName")),
        idType: formValue(formData.get("idType")),
        idNumber: formValue(formData.get("idNumber")),
        dateOfBirth: formValue(formData.get("dateOfBirth")),
        idDocumentLabel: formValue(formData.get("idDocumentLabel")),
      },
    });
    return;
  }

  if (stepId === "business-certificate") {
    await markStepComplete(user, userKey, stepId, {
      businessCertificate: {
        legalBusinessName: formValue(formData.get("legalBusinessName")),
        businessType: formValue(formData.get("businessType")),
        registrationNumber: formValue(formData.get("registrationNumber")),
        taxId: formValue(formData.get("taxId")),
        yearEstablished: formValue(formData.get("yearEstablished")),
        certificateLabel: formValue(formData.get("certificateLabel")),
      },
    });
    return;
  }

  const hiringRoles = formData
    .getAll("hiringRoles")
    .map((value) => String(value))
    .filter(Boolean);

  await markStepComplete(user, userKey, stepId, {
    businessDetails: {
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      zip: String(formData.get("zip") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      contactPhone: String(formData.get("contactPhone") ?? ""),
      website: String(formData.get("website") ?? ""),
      hiringRoles,
      locationsCount: String(formData.get("locationsCount") ?? "1"),
      notes: String(formData.get("notes") ?? ""),
    },
  });
}

// Type alias for Supabase layer
export type EmployerOnboardingState = OnboardingProgress;

export async function hydrateEmployerOnboardingFromDb(
  userId: string,
): Promise<OnboardingProgress | null> {
  const { fetchEmployerOnboardingFromDb } = await import("./supabase/onboarding");
  const remote = await fetchEmployerOnboardingFromDb(userId);
  if (!remote) return null;
  if (typeof window !== "undefined") {
    localStorage.setItem(storageKey(userId), JSON.stringify(remote));
    dispatchOnboardingChange();
  }
  return remote;
}
