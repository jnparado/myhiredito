"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildWorkerContext, useAiJobMatches } from "@/app/hooks/useAiJobMatches";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import {
  getBoostLabel,
  getTierLabel,
} from "@/app/lib/jobAssessments";
import {
  getAssessmentResult,
  hasAppliedToJob,
} from "@/app/lib/jobApplications";
import { getOrCreateEmployerConversation } from "@/app/lib/messages";
import {
  formatFullAddress,
  type JobDetailMeta,
} from "../lib/jobDetails";
import type { Job } from "../lib/jobs";
import { getWorkerUserKey, isOnboardingComplete } from "@/app/lib/workerOnboarding";

type Props = {
  job: Job;
  meta: JobDetailMeta;
};

export function JobDetailView({ job, meta }: Props) {
  const [directionFrom, setDirectionFrom] = useState<"home" | "location">("home");
  const [copied, setCopied] = useState(false);
  const [messageConversationId, setMessageConversationId] = useState<string | null>(
    null,
  );
  const { user, loading: authLoading } = useWorkerAuth();
  const { progress, loading: onboardingLoading } = useWorkerOnboarding();
  const userKey = getWorkerUserKey(user);
  const assessmentResult =
    userKey && !authLoading ? getAssessmentResult(userKey, job.slug) : null;
  const applied =
    userKey && !authLoading ? hasAppliedToJob(userKey, job.slug) : false;
  const onboardingComplete = isOnboardingComplete(progress);
  const workerContext = user
    ? buildWorkerContext({
        displayName: user.displayName,
        profile: user.profile,
        onboardingComplete,
        completedSteps: progress.completedSteps,
      })
    : null;
  const { matches } = useAiJobMatches(workerContext, userKey, useMemo(() => [job], [job]));
  const jobMatch = matches[job.slug];

  useEffect(() => {
    if (!userKey) return;
    setMessageConversationId(
      getOrCreateEmployerConversation(userKey, job.company, job.title),
    );
  }, [userKey, job.company, job.title]);

  const fullAddress = formatFullAddress(meta);
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${meta.lng - 0.02}%2C${meta.lat - 0.015}%2C${meta.lng + 0.02}%2C${meta.lat + 0.015}&layer=mapnik&marker=${meta.lat}%2C${meta.lng}`;

  async function copyAddress() {
    await navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const applyHref = user
    ? onboardingComplete
      ? `/worker/jobs/${job.slug}/assessment`
      : "/worker/dashboard"
    : "/worker/login";
  const applyLabel = user
    ? applied
      ? "View application"
      : assessmentResult
        ? "Apply with boost"
        : "Take exam & apply"
    : "Apply now";

  return (
    <div className="min-h-screen bg-white pb-28">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-md items-center px-4 py-3">
          <Link
            href="/worker/jobs"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--brand-dark)] hover:bg-[var(--surface)]"
            aria-label="Back to jobs"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-base font-semibold text-[var(--brand-dark)]">
            Job Details
          </h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="mx-auto max-w-md">
        <div className="px-5 pt-6">
          <h2 className="text-2xl font-bold leading-tight text-[var(--brand-dark)]">
            {job.title}
          </h2>
        </div>

        <div className="mt-5 flex items-center gap-3 px-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400 text-lg font-bold text-[var(--brand-dark)]">
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[var(--brand-dark)]">
              {job.company} – {meta.employmentType}
            </div>
            <div className="text-sm text-[var(--muted)]">{job.category}</div>
            <div className="mt-0.5 flex items-center gap-1 text-sm">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-[var(--brand-dark)]">
                {meta.rating.toFixed(1)}
              </span>
              <span className="text-[var(--muted)]">({meta.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="mt-5 px-5">
          <div className="inline-flex rounded-full bg-[var(--brand-dark)] px-6 py-3 text-lg font-bold text-white">
            {meta.hourlyRate}
          </div>
          {jobMatch && (
            <div className="mt-3 rounded-xl border border-[#1db954]/20 bg-[#1db954]/5 px-4 py-3">
              <p className="text-sm font-bold text-[#1a5c42]">
                ✦ {jobMatch.score}% AI match · {jobMatch.label}
              </p>
              <p className="mt-1 text-xs text-zinc-600">{jobMatch.reasons.join(" · ")}</p>
            </div>
          )}
        </div>

        {/* Role readiness exam */}
        <section className="mx-5 mt-6 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-light)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg">
              📝
            </span>
            <div>
              <h3 className="text-sm font-bold text-[var(--brand-dark)]">
                Boost your hire chance
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--brand-dark)]/80">
                Take a quick {job.category.toLowerCase()} exam before you apply.
                Strong scores add a visibility boost employers can see.
              </p>
              {assessmentResult && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--brand-dark)]">
                    {assessmentResult.percent}% — {getTierLabel(assessmentResult.tier)}
                  </span>
                  {getBoostLabel(assessmentResult.tier) && (
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                      {getBoostLabel(assessmentResult.tier)}
                    </span>
                  )}
                </div>
              )}
              {user && onboardingComplete && (
                <Link
                  href={`/worker/jobs/${job.slug}/assessment`}
                  className="mt-3 inline-flex text-sm font-bold text-[var(--brand)] hover:underline"
                >
                  {assessmentResult ? "Retake role exam" : "Start quick exam →"}
                </Link>
              )}
              {user && !onboardingLoading && !onboardingComplete && (
                <p className="mt-3 text-xs font-semibold text-red-700">
                  Complete onboarding to unlock the role exam.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 px-5">
          <div className="text-sm font-bold tracking-wide text-[var(--brand-dark)]">
            {meta.scheduleRange}
          </div>
          <div className="mt-1 text-sm font-bold text-[var(--brand-dark)]">
            {meta.shiftTime} {meta.timezone}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <span>
              Est. pay per workday is{" "}
              <span className="font-semibold text-[var(--brand-dark)]">
                {meta.estimatedDailyPay}
              </span>{" "}
              before tax
            </span>
            <span className="rounded bg-[var(--brand-light)] px-1.5 py-0.5 text-xs font-bold text-[var(--brand)]">
              {meta.employmentType}
            </span>
          </div>
        </div>

        <hr className="mx-5 mt-6 border-black/5" />

        <section className="px-5 pt-6">
          <h3 className="text-base font-bold text-[var(--brand-dark)]">
            Available Dates and Times
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            You will be able to select days once you finish the job requirements.
          </p>
          <ul className="mt-4 divide-y divide-black/5">
            {meta.shifts.map((shift) => (
              <li
                key={shift.dateLabel}
                className="flex items-center justify-between py-3.5"
              >
                <span className="text-sm font-medium text-[var(--brand-dark)]">
                  {shift.dateLabel}
                </span>
                <div className="text-right">
                  <div className="text-sm text-[var(--muted)]">{shift.time}</div>
                  <div className="text-sm font-semibold text-[var(--brand-dark)]">
                    {shift.rate}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-5 mt-6 rounded-xl bg-amber-50 p-4">
          <h3 className="text-sm font-bold text-[var(--brand-dark)]">
            Important Reminders
          </h3>
          <ul className="mt-3 space-y-4">
            <li className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
              <span className="mt-0.5 shrink-0 text-base">💵</span>
              <span>
                Payment is issued based on the employer&apos;s schedule after
                completed work.
              </span>
            </li>
            <li className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
              <span className="mt-0.5 shrink-0 text-base">🎫</span>
              <span>
                {meta.employmentType === "W2"
                  ? "Taxes are withheld for W2 jobs."
                  : "You are responsible for your own taxes on 1099 jobs."}
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-8 px-5">
          <h3 className="text-base font-bold text-[var(--brand-dark)]">
            Directions to {job.company}
          </h3>
          <div className="mt-2 flex items-start justify-between gap-2">
            <p className="text-sm leading-6 text-[var(--muted)]">{fullAddress}</p>
            <button
              type="button"
              onClick={copyAddress}
              className="shrink-0 text-sm font-semibold text-[var(--brand)]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </section>

        <div className="mx-5 mt-4 overflow-hidden rounded-xl border border-black/5">
          <iframe
            title={`Map of ${job.company}`}
            src={mapSrc}
            className="h-52 w-full"
            loading="lazy"
          />
        </div>

        <section className="mt-8 px-5">
          <h3 className="text-base font-bold text-[var(--brand-dark)]">
            About the role
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            {job.description}
          </p>

          <h3 className="mt-6 text-base font-bold text-[var(--brand-dark)]">
            Requirements
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm leading-7 text-[var(--muted)]">
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white p-4">
        <div className="mx-auto flex max-w-md gap-2">
          <Link
            href={applied ? "/worker/dashboard#applications" : applyHref}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white transition hover:bg-[var(--brand-strong)]"
          >
            {applyLabel}
          </Link>
          {user && messageConversationId ? (
            <Link
              href={`/worker/messages/${messageConversationId}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-dark)] text-[var(--brand-dark)]"
              aria-label="Message employer"
              title="Message employer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </Link>
          ) : !user ? (
            <Link
              href="/worker/login"
              className="flex h-12 items-center justify-center rounded-full border-2 border-[var(--brand-dark)] px-5 text-sm font-bold text-[var(--brand-dark)]"
            >
              Log in
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
