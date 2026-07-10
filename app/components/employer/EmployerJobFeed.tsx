"use client";

import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerJobs } from "@/app/hooks/useEmployerJobs";
import { getEmployerDisplayName } from "@/app/lib/employerAuth";
import {
  closeEmployerJob,
  formatPostedAgo,
  getEmployerUserKeyFromAuth,
} from "@/app/lib/employerJobs";
import { experienceLabels } from "@/app/lib/jobs";

function JobTypeLabel({ type }: { type: string }) {
  const labels: Record<string, string> = {
    "on-demand": "On-demand",
    ongoing: "Ongoing",
    "temp-to-perm": "Temp-to-perm",
  };
  return <>{labels[type] ?? type}</>;
}

function FeedAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50"
    >
      {icon}
      {label}
    </button>
  );
}

export function EmployerJobFeed() {
  const { user } = useEmployerAuth();
  const { jobs, loading } = useEmployerJobs();

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-300/60 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
        Loading your job posts...
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-300/60 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-2xl">
          📋
        </div>
        <p className="text-sm font-semibold text-zinc-700">No job posts yet</p>
        <p className="mt-1 text-xs text-zinc-500">
          Jobs you post will appear here in your hiring feed.
        </p>
      </div>
    );
  }

  const displayName = user ? getEmployerDisplayName(user) : "You";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Sort by:
        </p>
        <select className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700">
          <option>Recent</option>
          <option>Most applicants</option>
          <option>Active first</option>
        </select>
      </div>

      {jobs.map((job) => (
        <article
          key={job.id}
          className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm"
        >
          <div className="px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0f1115] text-sm font-bold text-white">
                {job.companyName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-zinc-900">
                  {displayName}
                  <span className="font-normal text-zinc-500">
                    {" "}
                    · Hiring at {job.companyName}
                  </span>
                </p>
                <p className="text-[11px] text-zinc-500">
                  {formatPostedAgo(job.postedAt)} · {job.location}
                </p>
              </div>
              {job.status === "closed" && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">
                  Closed
                </span>
              )}
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-zinc-900">{job.title}</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-700 line-clamp-3">
                {job.description}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#1db954]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#1a5c42]">
                {job.pay}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
                <JobTypeLabel type={job.jobType} />
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
                {experienceLabels[job.experienceLevel]}
              </span>
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs font-semibold text-zinc-500">
              {job.applicants} applicant{job.applicants !== 1 ? "s" : ""} ·{" "}
              {job.views} view{job.views !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex border-t border-zinc-200">
            <FeedAction
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              }
              label="Applicants"
            />
            <FeedAction
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              }
              label="Share"
            />
            {job.status === "active" && user && (
              <FeedAction
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Close job"
                onClick={() => {
                  const userKey = getEmployerUserKeyFromAuth(user);
                  if (userKey) closeEmployerJob(userKey, job.id);
                }}
              />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
