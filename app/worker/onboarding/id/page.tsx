import { redirect } from "next/navigation";

export default function LegacyIdOnboardingPage() {
  redirect("/worker/onboarding/skills-certificates");
}
