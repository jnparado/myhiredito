export type EmployerOnboardingStepId = "identity" | "business-certificate" | "business-details";

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

export type EmployerOnboardingState = {
  completedSteps: EmployerOnboardingStepId[];
  dismissed: boolean;
  data: Partial<EmployerOnboardingData>;
};

const STORAGE_KEY = "myhiredito_employer_onboarding";
let syncUserId: string | null = null;

export function setEmployerOnboardingSyncUserId(userId: string | null) {
  syncUserId = userId;
}

export const EMPLOYER_ONBOARDING_STEPS: {
  id: EmployerOnboardingStepId;
  step: number;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "identity",
    step: 1,
    title: "Government ID",
    subtitle: "Verify the authorized representative",
  },
  {
    id: "business-certificate",
    step: 2,
    title: "Business certificate",
    subtitle: "Legal entity and registration proof",
  },
  {
    id: "business-details",
    step: 3,
    title: "Business details",
    subtitle: "Locations, industry, and hiring needs",
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

const defaultState: EmployerOnboardingState = {
  completedSteps: [],
  dismissed: false,
  data: {},
};

function dispatchOnboardingChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-onboarding"));
}

export function getEmployerOnboardingState(): EmployerOnboardingState {
  if (typeof window === "undefined") return defaultState;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveEmployerOnboardingState(state: EmployerOnboardingState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  dispatchOnboardingChange();

  if (syncUserId) {
    void import("./supabase/onboarding").then(({ saveEmployerOnboardingToDb }) =>
      saveEmployerOnboardingToDb(syncUserId!, state),
    );
  }
}

export function resetEmployerOnboardingState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  dispatchOnboardingChange();

  if (syncUserId) {
    void import("./supabase/onboarding").then(({ resetEmployerOnboardingInDb }) =>
      resetEmployerOnboardingInDb(syncUserId!),
    );
  }
}

export function isEmployerOnboardingComplete(
  state: EmployerOnboardingState = getEmployerOnboardingState(),
): boolean {
  return EMPLOYER_ONBOARDING_STEPS.every((step) =>
    state.completedSteps.includes(step.id),
  );
}

export function completeEmployerOnboardingStep(
  stepId: EmployerOnboardingStepId,
  data:
    | EmployerOnboardingData["identity"]
    | EmployerOnboardingData["businessCertificate"]
    | EmployerOnboardingData["businessDetails"],
): EmployerOnboardingState {
  const current = getEmployerOnboardingState();
  const completedSteps = current.completedSteps.includes(stepId)
    ? current.completedSteps
    : [...current.completedSteps, stepId];

  const dataKey =
    stepId === "business-certificate"
      ? "businessCertificate"
      : stepId === "business-details"
        ? "businessDetails"
        : stepId;

  const next: EmployerOnboardingState = {
    ...current,
    completedSteps,
    dismissed: false,
    data: {
      ...current.data,
      [dataKey]: data,
    },
  };

  saveEmployerOnboardingState(next);
  return next;
}

export function dismissEmployerOnboarding(): EmployerOnboardingState {
  const current = getEmployerOnboardingState();
  const next = { ...current, dismissed: true };
  saveEmployerOnboardingState(next);
  return next;
}

export function reopenEmployerOnboarding(): EmployerOnboardingState {
  const current = getEmployerOnboardingState();
  const next = { ...current, dismissed: false };
  saveEmployerOnboardingState(next);
  return next;
}

export async function hydrateEmployerOnboardingFromDb(
  userId: string,
): Promise<EmployerOnboardingState | null> {
  const { fetchEmployerOnboardingFromDb } = await import("./supabase/onboarding");
  const remote = await fetchEmployerOnboardingFromDb(userId);
  if (!remote) return null;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    dispatchOnboardingChange();
  }
  return remote;
}
