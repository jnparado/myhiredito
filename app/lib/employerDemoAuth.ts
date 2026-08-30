export const EMPLOYER_DEMO_EMAIL = "employer@gmail.com";
export const EMPLOYER_DEMO_PASSWORD = "demo1234";
export const EMPLOYER_DEMO_EMAIL_ALIASES = [
  EMPLOYER_DEMO_EMAIL,
  "employer@demo.com",
] as const;

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
const ONBOARDING_PREFIX = "myhiredito_employer_onboarding_";

export const EMPLOYER_DEMO_ONBOARDING = {
  completedSteps: ["identity", "business-certificate", "business-details"],
  dismissed: false,
  data: {
    identity: {
      legalName: "Jordan Lee",
      idType: "Driver's license",
      idNumber: "DL-4829103",
      dateOfBirth: "1988-04-12",
      idDocumentLabel: "drivers-license.pdf",
    },
    businessCertificate: {
      legalBusinessName: "Summit Healthcare Staffing",
      businessType: "LLC",
      registrationNumber: "TX-8847291",
      taxId: "88-2918473",
      yearEstablished: "2018",
      certificateLabel: "business-cert.pdf",
    },
    businessDetails: {
      address: "500 Congress Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
      industry: "Healthcare",
      contactPhone: "(512) 555-0100",
      website: "https://summithealthcare.example.com",
      hiringRoles: ["Certified Nursing Assistant (CNA)", "Registered Nurse (RN)"],
      locationsCount: "3",
      notes: "Demo employer account — post jobs and review applicants.",
    },
  },
} as const;

function seedDemoEmployerOnboarding(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${ONBOARDING_PREFIX}${EMPLOYER_DEMO_EMAIL}`,
    JSON.stringify(EMPLOYER_DEMO_ONBOARDING),
  );
  window.dispatchEvent(new Event("myhiredito-employer-onboarding"));
}

export function isEmployerDemoEmail(email: string): boolean {
  return EMPLOYER_DEMO_EMAIL_ALIASES.includes(
    email.trim().toLowerCase() as (typeof EMPLOYER_DEMO_EMAIL_ALIASES)[number],
  );
}

export function isEmployerDemoCredentials(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (normalized === EMPLOYER_DEMO_EMAIL && password === EMPLOYER_DEMO_PASSWORD) {
    return true;
  }
  return normalized === "employer@demo.com" && password === "demo123";
}

export function setDemoEmployerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(EMPLOYER_DEMO_USER));
  seedDemoEmployerOnboarding();
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
