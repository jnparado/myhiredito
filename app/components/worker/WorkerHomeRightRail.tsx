"use client";

import Link from "next/link";
import { useJobApplications } from "@/app/hooks/useJobApplications";
import { jobs } from "@/app/lib/jobs";
import { OnboardingTaskList } from "./OnboardingTaskList";

const SHIFT_TIPS = [
  {
    title: "Post availability early",
    detail: "Workers who share open windows get 2× more shift invites",
  },
  {
    title: "Take the role exam",
    detail: "80%+ scores unlock Quick Apply on matched jobs",
  },
  {
    title: "Keep certs current",
    detail: "Verified credentials rank you higher in employer feeds",
  },
];

const HIRING_NOW = jobs.slice(0, 4).map((job) => ({
  company: job.company,
  role: job.title.split("(")[0].trim(),
  pay: job.pay,
  slug: job.slug,
}));

export function WorkerHomeRightRail() {
  const { applications } = useJobApplications();

  return (
    <aside className="space-y-2">
      <OnboardingTaskList />

      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-800">Worker playbook</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {SHIFT_TIPS.map((tip) => (
            <li key={tip.title} className="px-4 py-3">
              <p className="text-xs font-bold text-zinc-800">{tip.title}</p>
              <p className="mt-0.5 text-[11px] leading-5 text-zinc-500">
                {tip.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div
        id="applications"
        className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm"
      >
        <div className="border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-800">My applications</h2>
        </div>
        {applications.length === 0 ? (
          <p className="px-4 py-4 text-xs text-zinc-500">
            No applications yet.{" "}
            <Link href="/worker/jobs" className="font-bold text-[#1db954]">
              Browse jobs
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {applications.slice(0, 3).map((app) => (
              <li key={app.jobSlug} className="px-4 py-3">
                <p className="truncate text-xs font-bold text-zinc-800">
                  {app.jobTitle}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  {app.company} · Submitted
                </p>
              </li>
            ))}
          </ul>
        )}
        {applications.length > 0 && (
          <div className="border-t border-zinc-100 px-4 py-3">
            <Link
              href="/worker/dashboard#applications"
              className="text-xs font-bold text-zinc-600 hover:text-[#1db954]"
            >
              View all applications →
            </Link>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-800">Hiring now near you</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {HIRING_NOW.map((item) => (
            <li key={item.slug} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">
                {item.company.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-zinc-800">
                  {item.company}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  {item.role} · {item.pay}
                </p>
              </div>
              <Link
                href={`/worker/jobs/${item.slug}`}
                className="shrink-0 rounded-full border border-zinc-400 px-3 py-1 text-[10px] font-bold uppercase text-zinc-600 transition hover:border-[#1db954] hover:text-[#1db954]"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-zinc-100 px-4 py-3">
          <Link
            href="/worker/jobs"
            className="text-xs font-bold text-zinc-600 hover:text-[#1db954]"
          >
            See all open roles →
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-300/60 bg-white px-4 py-3 text-center shadow-sm">
        <p className="text-[10px] leading-5 text-zinc-400">
          <Link href="/worker" className="hover:underline">
            About
          </Link>
          {" · "}
          <Link href="/worker/jobs" className="hover:underline">
            Help
          </Link>
          {" · "}
          <Link href="/worker/onboarding/profile" className="hover:underline">
            Privacy
          </Link>
        </p>
        <p className="mt-1 text-[10px] text-zinc-400">MyHiredito © 2026</p>
      </div>
    </aside>
  );
}
