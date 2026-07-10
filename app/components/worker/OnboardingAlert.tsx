"use client";

import Link from "next/link";
import {
  getIncompleteOnboardingSteps,
  getOnboardingCompletionCount,
  isOnboardingComplete,
  resumeOnboarding,
} from "@/app/lib/workerOnboarding";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";

export function OnboardingAlert() {
  const { user, userKey, progress, loading } = useWorkerOnboarding();

  if (loading || !userKey || isOnboardingComplete(progress)) return null;

  const incomplete = getIncompleteOnboardingSteps(progress);
  const { completed, total } = getOnboardingCompletionCount(progress);
  const nextStep = incomplete[0];

  return (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-3 sm:mb-6 sm:px-4 sm:py-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            !
          </span>
          <div>
            <p className="text-sm font-bold text-red-800">
              Account setup incomplete
            </p>
            <p className="mt-1 text-sm text-red-700">
              Finish onboarding to verify your profile and apply for jobs.
              {completed > 0
                ? ` ${completed} of ${total} steps done.`
                : ` ${total} steps remaining.`}
            </p>
            {nextStep && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-red-600">
                Next: Step {nextStep.step} — {nextStep.label}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {progress.dismissed && (
            <button
              type="button"
              onClick={() => {
                if (user && userKey) void resumeOnboarding(user, userKey);
              }}
              className="rounded border border-red-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-red-100"
            >
              Show tasks
            </button>
          )}
          {nextStep && (
            <Link
              href={nextStep.href}
              className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-red-700"
            >
              Continue setup
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
