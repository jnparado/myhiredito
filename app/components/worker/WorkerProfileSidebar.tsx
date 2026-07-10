"use client";

import Link from "next/link";
import { useJobApplications } from "@/app/hooks/useJobApplications";
import { useMessages } from "@/app/hooks/useMessages";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { getEmployerViewCount } from "@/app/lib/workerFeed";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import {
  getIncompleteOnboardingSteps,
  getOnboardingCompletionCount,
  isOnboardingComplete,
} from "@/app/lib/workerOnboarding";

function StatRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <>
      <span className="text-xs font-semibold text-zinc-800">{value}</span>
      <span className="text-[11px] text-zinc-500">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-1 flex-col items-center border-r border-zinc-200 py-3 last:border-r-0 hover:bg-zinc-50"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center border-r border-zinc-200 py-3 last:border-r-0">
      {content}
    </div>
  );
}

export function WorkerProfileSidebar() {
  const { user, loading } = useWorkerAuth();
  const { progress } = useWorkerOnboarding();
  const { applications } = useJobApplications();
  const { unreadCount } = useMessages();

  if (loading || !user) return null;

  const name = getWorkerDisplayName(user);
  const onboardingComplete = isOnboardingComplete(progress);
  const { completed, total } = getOnboardingCompletionCount(progress);
  const nextStep = getIncompleteOnboardingSteps(progress)[0];
  const employerViews = getEmployerViewCount(applications.length);

  return (
    <aside className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="h-14 bg-gradient-to-r from-[#0f1115] via-[#1a3d2e] to-[#1db954]/80" />
        <div className="px-4 pb-4">
          <div className="-mt-7 mb-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#1db954] text-lg font-bold text-white">
            {name.charAt(0)}
          </div>
          <Link
            href="/worker/onboarding/profile"
            className="text-sm font-bold text-zinc-900 hover:text-[#1db954] hover:underline"
          >
            {name}
          </Link>
          <p className="mt-0.5 text-xs leading-5 text-zinc-600">
            {onboardingComplete
              ? "Verified worker · Open to shifts"
              : "Worker profile · Setup in progress"}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Austin, TX area</p>

          {!onboardingComplete && nextStep && (
            <Link
              href={nextStep.href}
              className="mt-3 flex w-full items-center justify-center rounded-full border border-dashed border-zinc-300 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-[#1db954] hover:text-[#1db954]"
            >
              + {nextStep.label}
            </Link>
          )}
        </div>

        <div className="flex border-t border-zinc-200">
          <StatRow
            label="Applications"
            value={applications.length}
            href="/worker/dashboard#applications"
          />
          <StatRow
            label="Messages"
            value={unreadCount}
            href="/worker/messages"
          />
          <StatRow
            label="Employer views"
            value={employerViews}
            href="/worker/connect"
          />
        </div>

        <div className="border-t border-zinc-200 px-4 py-3">
          <Link
            href="/worker/jobs"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">🔖</span>
            Saved jobs
          </Link>
          <Link
            href="/worker/dashboard#applications"
            className="mt-2 flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">📋</span>
            My applications
          </Link>
          <Link
            href="/worker/connect"
            className="mt-2 flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">👥</span>
            My circle
          </Link>
          <Link
            href="/worker/messages"
            className="mt-2 flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">💬</span>
            Shift alerts
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="flex items-start gap-3 px-4 py-3">
          <span className="text-xl">✓</span>
          <div>
            <p className="text-xs font-bold text-zinc-900">Verified Pro</p>
            <p className="mt-0.5 text-[11px] leading-5 text-zinc-500">
              {onboardingComplete
                ? "Take role exams to rank higher in employer feeds."
                : `Complete ${total - completed} more setup step${total - completed === 1 ? "" : "s"} to unlock Verified Pro.`}
            </p>
            <Link
              href={onboardingComplete ? "/worker/jobs" : (nextStep?.href ?? "/worker/onboarding/profile")}
              className="mt-2 inline-block text-[11px] font-bold text-[#1db954] hover:underline"
            >
              {onboardingComplete ? "Browse role exams →" : "Finish verification →"}
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-300/60 bg-white px-4 py-3 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
          Profile strength
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-[#1db954] transition-all"
            style={{
              width: `${Math.round((completed / total) * 100)}%`,
            }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-zinc-500">
          {completed}/{total} steps ·{" "}
          {onboardingComplete ? "Ready to quick-apply" : "Higher match after setup"}
        </p>
      </div>
    </aside>
  );
}
