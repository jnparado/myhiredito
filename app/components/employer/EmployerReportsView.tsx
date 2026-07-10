"use client";

import Link from "next/link";
import { useEmployerApplicants } from "@/app/hooks/useEmployerApplicants";
import { useEmployerJobs } from "@/app/hooks/useEmployerJobs";
import { useEmployerMessages } from "@/app/hooks/useEmployerMessages";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import { useEmployerWorkers } from "@/app/hooks/useEmployerWorkers";

export function EmployerReportsView() {
  const { jobs, activeCount } = useEmployerJobs();
  const { totalCount, newCount } = useEmployerApplicants();
  const { workers } = useEmployerWorkers();
  const { unreadCount } = useEmployerMessages();
  const { isComplete, completedCount } = useEmployerOnboarding();

  const hiredCount = workers.filter((w) => w.status === "hired").length;
  const invitedCount = workers.filter((w) => w.status === "invited").length;
  const totalViews = jobs.reduce((sum, j) => sum + j.views, 0);
  const closedJobs = jobs.filter((j) => j.status === "closed").length;

  const metrics = [
    { label: "Active job posts", value: activeCount, href: "/employer/dashboard" },
    { label: "Total applicants", value: totalCount, href: "/employer/applicants" },
    { label: "New applicants", value: newCount, href: "/employer/applicants" },
    { label: "Workers invited", value: invitedCount, href: "/employer/workers" },
    { label: "Workers hired", value: hiredCount, href: "/employer/workers" },
    { label: "Unread messages", value: unreadCount, href: "/employer/messages" },
    { label: "Job post views", value: totalViews, href: "/employer/dashboard" },
    { label: "Closed jobs", value: closedJobs, href: "/employer/dashboard" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Analytics
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Reports</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track hiring performance, applicant flow, and account activity.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-[#1db954]"
          >
            <p className="text-2xl font-bold text-zinc-900">{metric.value}</p>
            <p className="mt-1 text-xs font-semibold text-zinc-500">{metric.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900">Onboarding status</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {isComplete
              ? "Your business is fully verified and ready to hire."
              : `${completedCount} of 3 onboarding steps complete.`}
          </p>
          {!isComplete && (
            <Link
              href="/employer/dashboard"
              className="mt-3 inline-flex text-sm font-semibold text-[#1db954] hover:underline"
            >
              Complete onboarding →
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900">Hiring funnel</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li className="flex justify-between">
              <span>Applicants received</span>
              <span className="font-bold">{totalCount}</span>
            </li>
            <li className="flex justify-between">
              <span>Workers invited</span>
              <span className="font-bold">{invitedCount}</span>
            </li>
            <li className="flex justify-between">
              <span>Workers hired</span>
              <span className="font-bold">{hiredCount}</span>
            </li>
            <li className="flex justify-between border-t border-zinc-100 pt-2">
              <span>Fill rate</span>
              <span className="font-bold text-[#1a5c42]">
                {totalCount > 0
                  ? `${Math.round((hiredCount / totalCount) * 100)}%`
                  : "—"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
