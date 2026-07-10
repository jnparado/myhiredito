"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useEmployerApplicants } from "@/app/hooks/useEmployerApplicants";
import { useEmployerJobs } from "@/app/hooks/useEmployerJobs";
import {
  APPLICANT_STATUS_COLORS,
  APPLICANT_STATUS_LABELS,
  updateApplicantStatus,
  type ApplicantStatus,
  type JobApplicant,
} from "@/app/lib/employerApplicants";
import { createEmployerConversationFromApplicant } from "@/app/lib/employerMessages";

export function EmployerApplicantsView() {
  const searchParams = useSearchParams();
  const { userKey, applicants, loading } = useEmployerApplicants();
  const { jobs } = useEmployerJobs();
  const [statusFilter, setStatusFilter] = useState<ApplicantStatus | "all">("all");
  const [jobFilter, setJobFilter] = useState<string>("all");

  useEffect(() => {
    const jobParam = searchParams.get("job");
    if (jobParam) setJobFilter(jobParam);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (jobFilter !== "all" && a.jobId !== jobFilter) return false;
      return true;
    });
  }, [applicants, jobFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading applicants...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Hiring pipeline
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Applicants</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Review, interview, and hire verified workers for your open roles.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700"
        >
          <option value="all">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicantStatus | "all")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700"
        >
          <option value="all">All statuses</option>
          {(Object.keys(APPLICANT_STATUS_LABELS) as ApplicantStatus[]).map((s) => (
            <option key={s} value={s}>
              {APPLICANT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-zinc-700">No applicants match your filters</p>
          <Link
            href="/employer/dashboard?post=1"
            className="mt-4 inline-flex rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Post a job to attract applicants
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              userKey={userKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicantCard({
  applicant,
  userKey,
}: {
  applicant: JobApplicant;
  userKey: string | null;
}) {
  function handleStatusChange(status: ApplicantStatus) {
    if (!userKey) return;
    updateApplicantStatus(userKey, applicant.id, status);
  }

  function handleMessage() {
    if (!userKey) return;
    const convId = createEmployerConversationFromApplicant(userKey, applicant);
    window.location.href = `/employer/messages/${convId}`;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600">
            {applicant.workerName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-zinc-900">{applicant.workerName}</p>
            <p className="text-sm text-zinc-500">{applicant.jobTitle}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {applicant.skills} · {applicant.location}
            </p>
            {applicant.examScore != null && (
              <p className="mt-1 text-xs font-semibold text-[#1a5c42]">
                Role exam: {applicant.examScore}%
              </p>
            )}
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${APPLICANT_STATUS_COLORS[applicant.status]}`}
        >
          {APPLICANT_STATUS_LABELS[applicant.status]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={applicant.status}
          onChange={(e) => handleStatusChange(e.target.value as ApplicantStatus)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700"
        >
          {(Object.keys(APPLICANT_STATUS_LABELS) as ApplicantStatus[]).map((s) => (
            <option key={s} value={s}>
              {APPLICANT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleMessage}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
        >
          Message
        </button>
      </div>
    </div>
  );
}
