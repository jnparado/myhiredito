import { redirect } from "next/navigation";

export default function LegacyCertificatesOnboardingPage() {
  redirect("/worker/onboarding/payment");
}
