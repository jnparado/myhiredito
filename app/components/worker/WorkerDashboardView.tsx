"use client";

import Link from "next/link";
import { OnboardingAlert } from "./OnboardingAlert";
import { OnboardingTaskList } from "./OnboardingTaskList";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { useJobApplications } from "@/app/hooks/useJobApplications";
import { useMessages } from "@/app/hooks/useMessages";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import { jobs } from "@/app/lib/jobs";
import {
  getBoostLabel,
  getTierLabel,
} from "@/app/lib/jobAssessments";
import {
  getIncompleteOnboardingSteps,
  getOnboardingCompletionCount,
  isOnboardingComplete,
} from "@/app/lib/workerOnboarding";

const recommendedJobs = jobs.slice(0, 4);

function Panel({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500 group-hover:text-[var(--brand)]">
        {hint} →
      </p>
    </Link>
  );
}

export function WorkerDashboardView() {
  const { user } = useWorkerAuth();
  const { progress, loading: onboardingLoading } = useWorkerOnboarding();
  const { applications, loading: applicationsLoading } = useJobApplications();
  const { unreadCount } = useMessages();

  const displayName = user ? getWorkerDisplayName(user) : "Worker";
  const firstName = displayName.split(" ")[0];
  const onboardingComplete = isOnboardingComplete(progress);
  const { completed, total } = getOnboardingCompletionCount(progress);
  const nextStep = getIncompleteOnboardingSteps(progress)[0];
  const applicationCount = applications.length;

  function openMessaging() {
    window.dispatchEvent(new Event("myhiredito-open-messaging"));
  }

  return (
    <div className="min-h-full bg-[var(--surface)] pb-4 sm:pb-10">
      <div className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        {/* Welcome */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0f1115] via-[#1a2e24] to-[var(--brand-dark)] px-4 py-6 text-white sm:px-8 sm:py-8">
            <p className="text-sm font-medium text-white/70">Worker dashboard</p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
              {onboardingComplete
                ? "Browse roles, take exams to boost your hire chance, and track applications in one place."
                : "Finish your profile setup to unlock job applications and employer messaging."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={onboardingComplete ? "/worker/jobs" : (nextStep?.href ?? "/worker/onboarding/profile")}
                className="inline-flex items-center rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-strong)]"
              >
                {onboardingComplete ? "Browse open jobs" : "Continue setup"}
              </Link>
              {onboardingComplete && (
                <Link
                  href="/worker/dashboard#applications"
                  className="inline-flex items-center rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  View applications
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 px-6 py-4 sm:px-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-lg font-bold text-white">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900">{displayName}</p>
              <p className="text-sm text-zinc-500">
                {onboardingLoading
                  ? "Loading profile..."
                  : onboardingComplete
                    ? "Verified worker · Ready to apply"
                    : `${completed} of ${total} setup steps complete`}
              </p>
            </div>
            <Link
              href="/worker/onboarding/profile"
              className="text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              Edit profile
            </Link>
          </div>
        </div>

        <OnboardingAlert />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Applications"
            value={applicationsLoading ? "—" : applicationCount}
            hint="Track your submissions"
            href="/worker/dashboard#applications"
          />
          <StatCard
            label="Onboarding"
            value={onboardingLoading ? "—" : `${completed}/${total}`}
            hint={onboardingComplete ? "Profile verified" : "Finish setup"}
            href={nextStep?.href ?? "/worker/onboarding/profile"}
          />
          <StatCard
            label="Messages"
            value={unreadCount}
            hint={unreadCount > 0 ? "Unread from employers" : "Open inbox"}
            href="/worker/messages"
          />
          <StatCard
            label="Open roles"
            value={jobs.length}
            hint="Jobs available now"
            href="/worker/jobs"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Panel className="p-5">
              <h2 className="text-base font-bold text-zinc-900">Quick actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/worker/jobs"
                  className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-[var(--surface)] p-4 transition hover:border-[var(--brand)]/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-light)] text-lg">
                    🔍
                  </span>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Find jobs</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Search by role and location
                    </p>
                  </div>
                </Link>
                <Link
                  href={nextStep?.href ?? "/worker/onboarding/profile"}
                  className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-[var(--surface)] p-4 transition hover:border-[var(--brand)]/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-lg">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Update profile</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      ID, certs, and work history
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={openMessaging}
                  className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-[var(--surface)] p-4 text-left transition hover:border-[var(--brand)]/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-lg">
                    💬
                  </span>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Messages</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Chat with recruiters
                    </p>
                  </div>
                </button>
              </div>
            </Panel>

            {/* Applications */}
            <Panel id="applications" className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-zinc-900">My applications</h2>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                  {applicationsLoading ? "—" : applicationCount} total
                </span>
              </div>

              {applicationCount > 0 ? (
                <ul className="mt-4 divide-y divide-zinc-100">
                  {applications.map((application) => (
                    <li key={application.jobSlug} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-zinc-900">
                            {application.jobTitle}
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-500">
                            {application.company} · {application.location}
                          </p>
                          {application.assessment && (
                            <p className="mt-1.5 text-xs font-semibold text-[var(--brand)]">
                              Role exam {application.assessment.percent}% ·{" "}
                              {getTierLabel(application.assessment.tier)}
                              {getBoostLabel(application.assessment.tier)
                                ? ` · ${getBoostLabel(application.assessment.tier)}`
                                : ""}
                            </p>
                          )}
                        </div>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          Submitted
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-[var(--surface)] px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-zinc-700">
                    No applications yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {onboardingComplete
                      ? "Browse jobs and take a role exam before you apply."
                      : "Complete onboarding to start applying."}
                  </p>
                  <Link
                    href={onboardingComplete ? "/worker/jobs" : (nextStep?.href ?? "#")}
                    className="mt-4 inline-flex rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--brand-strong)]"
                  >
                    {onboardingComplete ? "Browse jobs" : "Continue setup"}
                  </Link>
                </div>
              )}
            </Panel>

            {/* Recommended jobs */}
            <Panel className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-zinc-900">Recommended for you</h2>
                <Link
                  href="/worker/jobs"
                  className="text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  See all
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {recommendedJobs.map((job) => (
                  <li key={job.id}>
                    <Link
                      href={`/worker/jobs/${job.slug}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-100 p-4 transition hover:border-[var(--brand)]/30 hover:bg-[var(--surface)]"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900">{job.title}</p>
                        <p className="mt-0.5 text-sm text-zinc-500">
                          {job.company} · {job.location}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">{job.schedule}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--brand)]">{job.pay}</p>
                        <p className="mt-1 text-xs text-zinc-500">{job.category}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <OnboardingTaskList />

            <Panel className="p-5">
              <h3 className="text-sm font-bold text-zinc-900">Boost your hire chance</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Take a short role exam before applying. Strong scores show employers
                you&apos;re ready for the job.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <span className="font-bold text-[var(--brand)]">80%+</span>
                  <span>Strong boost on your application</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[var(--brand)]">60%+</span>
                  <span>Moderate boost on your application</span>
                </li>
              </ul>
              <Link
                href="/worker/jobs"
                className="mt-4 inline-flex text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Find a role exam →
              </Link>
            </Panel>

            {unreadCount > 0 && (
              <Panel className="p-5">
                <h3 className="text-sm font-bold text-zinc-900">
                  {unreadCount} new message{unreadCount === 1 ? "" : "s"}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Employers are reaching out about your applications.
                </p>
                <button
                  type="button"
                  onClick={openMessaging}
                  className="mt-3 text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  Open messages
                </button>
              </Panel>
            )}

            <Panel className="p-5">
              <h3 className="text-sm font-bold text-zinc-900">Need help?</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/worker/jobs" className="text-zinc-600 hover:text-[var(--brand)]">
                    How to apply for jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/worker/onboarding/profile"
                    className="text-zinc-600 hover:text-[var(--brand)]"
                  >
                    Complete your worker profile
                  </Link>
                </li>
                <li>
                  <Link href="/worker/messages" className="text-zinc-600 hover:text-[var(--brand)]">
                    Message an employer
                  </Link>
                </li>
              </ul>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}
