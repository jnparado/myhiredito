"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  authButtonClass,
  authErrorClass,
  authFieldClass,
  authLabelClass,
} from "@/app/components/auth/AuthShell";
import {
  ONBOARDING_STEPS,
  saveOnboardingStep,
  type OnboardingStepId,
} from "@/app/lib/workerOnboarding";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";

type Props = {
  stepId: OnboardingStepId;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function OnboardingStepLayout({
  stepId,
  title,
  description,
  children,
}: Props) {
  const step = ONBOARDING_STEPS.find((item) => item.id === stepId);

  return (
    <div className="mx-auto max-w-2xl px-3 py-6 sm:px-6 sm:py-8">
      <Link
        href="/worker/dashboard"
        className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 transition hover:text-zinc-800"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="font-bold text-red-800">Onboarding required.</span>{" "}
        Complete this step to verify your account and unlock job applications.
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand)]">
          Step {step?.step ?? ""} of {ONBOARDING_STEPS.length}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

type SubmitProps = {
  stepId: OnboardingStepId;
  children: React.ReactNode;
};

export function OnboardingStepForm({ stepId, children }: SubmitProps) {
  const router = useRouter();
  const { user, userKey } = useWorkerOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !userKey) return;

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await saveOnboardingStep(user, userKey, stepId, formData);
      router.push("/worker/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {children}
      {error && <div className={authErrorClass}>{error}</div>}
      <button type="submit" disabled={loading || !userKey} className={authButtonClass}>
        {loading ? "Saving..." : "Save & continue"}
      </button>
    </form>
  );
}

export { authFieldClass, authLabelClass };
