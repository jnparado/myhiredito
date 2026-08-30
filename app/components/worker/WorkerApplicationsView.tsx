"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJobApplications } from "@/app/hooks/useJobApplications";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import {
  APPLICATION_STATUS_LABELS,
  type JobApplicationStatus,
} from "@/app/lib/jobApplications";

const STATUS_COLORS: Record<JobApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-700",
  "under-review": "bg-amber-100 text-amber-700",
  interview: "bg-purple-100 text-purple-700",
  hired: "bg-emerald-100 text-emerald-700",
  rejected: "bg-zinc-100 text-zinc-500",
};

const FILTERS: Array<JobApplicationStatus | "all"> = [
  "all",
  "submitted",
  "under-review",
  "interview",
  "hired",
  "rejected",
];

function formatAppliedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString();
}

export function WorkerApplicationsView() {
  const { user, loading: authLoading, authenticated } = useWorkerAuth();
  const { applications, loading } = useJobApplications();
  const [statusFilter, setStatusFilter] = useState<JobApplicationStatus | "all">(
    "all",
  );

  const filtered = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((item) => item.status === statusFilter);
  }, [applications, statusFilter]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading applications...
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Sign in to see applications</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Track every role you applied to and see whether it is under review,
          in interview, or hired.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/worker/login"
            className="rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Log in
          </Link>
          <Link
            href="/worker/signup"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Your pipeline
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Applications</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"} in your
          pipeline.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((status) => {
          const count =
            status === "all"
              ? applications.length
              : applications.filter((item) => item.status === status).length;
          const active = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-[#1db954] text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-[#1db954]/40"
              }`}
            >
              {status === "all" ? "All" : APPLICATION_STATUS_LABELS[status]}
              <span className={active ? "ml-1 text-white/80" : "ml-1 text-zinc-400"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-zinc-700">
            {applications.length === 0
              ? "No applications yet"
              : "No applications in this status"}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Browse open jobs and take the role exam to apply.
          </p>
          <Link
            href="/worker/jobs"
            className="mt-4 inline-flex rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((application) => (
            <li
              key={`${application.jobSlug}-${application.appliedAt}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900">{application.jobTitle}</p>
                  <p className="text-sm text-zinc-500">
                    {application.company}
                    {application.location ? ` · ${application.location}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {application.pay ? `${application.pay} · ` : ""}
                    Applied {formatAppliedAt(application.appliedAt)}
                  </p>
                  {application.assessment && (
                    <p className="mt-1 text-xs font-semibold text-[#1a5c42]">
                      Role exam: {application.assessment.percent}%
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[application.status]}`}
                >
                  {APPLICATION_STATUS_LABELS[application.status]}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link
                  href={`/worker/jobs/${application.jobSlug}`}
                  className="text-xs font-bold text-[#1db954] hover:underline"
                >
                  View job
                </Link>
                {application.status === "hired" && (
                  <Link
                    href="/worker/tracker"
                    className="text-xs font-bold text-zinc-600 hover:underline"
                  >
                    Open tracker
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
