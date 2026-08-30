"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJobApplications } from "@/app/hooks/useJobApplications";
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

export function WorkerApplicationsView() {
  const { applications, loading } = useJobApplications();
  const [statusFilter, setStatusFilter] = useState<JobApplicationStatus | "all">(
    "all",
  );

  const filtered = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((item) => item.status === statusFilter);
  }, [applications, statusFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading applications...
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
          Track every role you applied to and see where it stands.
        </p>
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as JobApplicationStatus | "all")
          }
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700"
        >
          <option value="all">All statuses</option>
          {(Object.keys(APPLICATION_STATUS_LABELS) as JobApplicationStatus[]).map(
            (status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ),
          )}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-zinc-700">No applications yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Browse open shifts and take the role exam to apply.
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
                <div>
                  <p className="font-bold text-zinc-900">{application.jobTitle}</p>
                  <p className="text-sm text-zinc-500">
                    {application.company} · {application.location}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {application.pay} · Applied{" "}
                    {new Date(application.appliedAt).toLocaleDateString()}
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
              <div className="mt-4">
                <Link
                  href={`/worker/jobs/${application.jobSlug}`}
                  className="text-xs font-bold text-[#1db954] hover:underline"
                >
                  View job
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
