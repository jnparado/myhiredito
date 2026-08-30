import type { AvailabilityType } from "./supabase/types";

export const WORKER_DEMO_EMAIL = "worker@demo.com";
export const WORKER_DEMO_PASSWORD = "demo123";
export const WORKER_DEMO_EMAIL_ALIASES = [
  WORKER_DEMO_EMAIL,
  "alex.rivera@email.com",
] as const;

export type WorkerDemoUser = {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
  location: string;
  availability: AvailabilityType;
  headline: string;
  skills: string[];
};

export const WORKER_DEMO_USER: WorkerDemoUser = {
  email: WORKER_DEMO_EMAIL,
  firstName: "Alex",
  lastName: "Rivera",
  displayName: "Alex Rivera",
  phone: "(512) 555-0142",
  location: "Austin, TX",
  availability: "flexible",
  headline: "Certified Nursing Assistant · 3 years experience",
  skills: ["CNA", "Patient Care", "CPR", "Vital Signs"],
};

export const WORKER_DEMO_BIO =
  "CNA with 3 years in assisted living and home health. CPR/BLS current. Available for Austin-area per-diem shifts.";

export const WORKER_DEMO_CERTIFICATES = {
  yearsExperience: "3",
  skills: "CNA, Patient Care, CPR, Vital Signs",
  workHistory:
    "CNA at Sunrise Senior Care (2023–present). Previously home health aide in Austin providing daily living support and medication reminders.",
  certificateName: "Certified Nursing Assistant",
  issuingBody: "Texas Health and Human Services",
  issueDate: "2023-03-15",
  expiryDate: "2027-03-15",
  licenseNumber: "TX-CNA-482910",
};

export const WORKER_DEMO_PAYOUT = {
  provider: "paypal" as const,
  handle: "alex.rivera@email.com",
};

const SESSION_KEY = "myhiredito_worker_demo_session";
const ONBOARDING_PREFIX = "myhiredito_worker_onboarding_";

export const WORKER_DEMO_ONBOARDING = {
  completedSteps: ["profile", "skills-certificates", "payment-method"] as const,
  dismissed: false,
};

export function isWorkerDemoAccount(email: string, displayName?: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (
    WORKER_DEMO_EMAIL_ALIASES.includes(
      normalized as (typeof WORKER_DEMO_EMAIL_ALIASES)[number],
    )
  ) {
    return true;
  }
  return displayName?.trim().toLowerCase() === "alex rivera";
}

export function isWorkerDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === WORKER_DEMO_EMAIL &&
    password === WORKER_DEMO_PASSWORD
  );
}

function seedDemoOnboarding(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${ONBOARDING_PREFIX}${WORKER_DEMO_EMAIL}`,
    JSON.stringify({
      completedSteps: ["profile", "skills-certificates", "payment-method"],
      dismissed: false,
    }),
  );
}

export function setDemoWorkerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(WORKER_DEMO_USER));
  seedDemoOnboarding();
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
  window.dispatchEvent(new Event("myhiredito-worker-onboarding"));
}

export function clearDemoWorkerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
}

export function getDemoWorkerSession(): WorkerDemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WorkerDemoUser;
  } catch {
    return null;
  }
}
