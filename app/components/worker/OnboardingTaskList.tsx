"use client";

import Link from "next/link";
import {
  dismissOnboarding,
  getOnboardingCompletionCount,
  isOnboardingComplete,
  ONBOARDING_STEPS,
} from "@/app/lib/workerOnboarding";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";

export function OnboardingTaskList() {
  const { user, userKey, progress, loading } = useWorkerOnboarding();

  if (loading || !userKey) return null;

  if (isOnboardingComplete(progress)) {
    return (
      <div className="overflow-hidden rounded border border-emerald-200 bg-emerald-50 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="text-emerald-600">✓</span>
          <p className="text-sm font-semibold text-emerald-800">
            Onboarding complete — you&apos;re verified and ready to apply.
          </p>
        </div>
      </div>
    );
  }

  if (progress.dismissed) return null;

  const { completed, total } = getOnboardingCompletionCount(progress);

  return (
    <div className="overflow-hidden rounded border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <div>
            <h2 className="text-sm font-bold text-zinc-700">Onboarding Task List</h2>
            <p className="text-[11px] font-semibold text-red-600">
              {completed}/{total} steps complete
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (user && userKey) void dismissOnboarding(user, userKey);
          }}
          className="rounded border border-zinc-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-600 transition hover:bg-zinc-50"
        >
          Skip
        </button>
      </div>

      <ul>
        {ONBOARDING_STEPS.map((task) => {
          const done = progress.completedSteps.includes(task.id);
          return (
            <li key={task.id} className="border-t border-zinc-100">
              <Link
                href={task.href}
                className={`flex items-center justify-between px-4 py-3.5 text-left text-sm transition hover:bg-zinc-50 ${
                  !done ? "bg-red-50/40" : ""
                }`}
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-base">{task.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Step {task.step}
                    </span>
                    <span
                      className={`block font-medium ${
                        done ? "text-zinc-500 line-through" : "text-zinc-800"
                      }`}
                    >
                      {task.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {task.description}
                    </span>
                  </span>
                </span>
                <span className="ml-3 flex shrink-0 items-center gap-2">
                  {done ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                      Done
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                      Required
                    </span>
                  )}
                  <svg
                    className="h-4 w-4 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
