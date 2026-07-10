export const EMPLOYER_DEMO_EMAIL = "employer@demo.com";
export const EMPLOYER_DEMO_PASSWORD = "demo123";

export type EmployerDemoUser = {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  companyName: string;
};

export const EMPLOYER_DEMO_USER: EmployerDemoUser = {
  email: EMPLOYER_DEMO_EMAIL,
  firstName: "Jordan",
  lastName: "Lee",
  displayName: "Jordan Lee",
  companyName: "Summit Healthcare Staffing",
};

const STORAGE_KEY = "myhiredito_employer_demo_session";

export function isEmployerDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === EMPLOYER_DEMO_EMAIL &&
    password === EMPLOYER_DEMO_PASSWORD
  );
}

export function setDemoEmployerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(EMPLOYER_DEMO_USER));
  window.dispatchEvent(new Event("myhiredito-employer-auth"));
}

export function clearDemoEmployerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("myhiredito-employer-auth"));
}

export function getDemoEmployerSession(): EmployerDemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EmployerDemoUser;
  } catch {
    return null;
  }
}
