import type { AvailabilityType } from "./supabase/types";

export const WORKER_DEMO_EMAIL = "worker@demo.com";
export const WORKER_DEMO_PASSWORD = "demo123";

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

const SESSION_KEY = "myhiredito_worker_demo_session";
const ONBOARDING_PREFIX = "myhiredito_worker_onboarding_";

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
