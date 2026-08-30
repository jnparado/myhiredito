import {
  EMPLOYER_DEMO_EMAIL,
  EMPLOYER_DEMO_PASSWORD,
  EMPLOYER_DEMO_USER,
} from "./employerDemoAuth";
import {
  WORKER_DEMO_EMAIL,
  WORKER_DEMO_PASSWORD,
  WORKER_DEMO_USER,
} from "./workerDemoAuth";
import type { UserRole } from "./supabase/database.types";

export const WORKER_DEMO_ONBOARDING_STEPS = [
  "profile",
  "skills-certificates",
  "payment-method",
] as const;

export function getDemoAccount(role: UserRole) {
  if (role === "employer") {
    return {
      email: EMPLOYER_DEMO_EMAIL,
      password: EMPLOYER_DEMO_PASSWORD,
      metadata: {
        role: "employer" as const,
        first_name: EMPLOYER_DEMO_USER.firstName,
        last_name: EMPLOYER_DEMO_USER.lastName,
        display_name: EMPLOYER_DEMO_USER.displayName,
        company_name: EMPLOYER_DEMO_USER.companyName,
      },
    };
  }

  return {
    email: WORKER_DEMO_EMAIL,
    password: WORKER_DEMO_PASSWORD,
    metadata: {
      role: "worker" as const,
      first_name: WORKER_DEMO_USER.firstName,
      last_name: WORKER_DEMO_USER.lastName,
      display_name: WORKER_DEMO_USER.displayName,
    },
  };
}
