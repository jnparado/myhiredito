"use client";

import Link from "next/link";
import { EmployerOnboardingTaskList } from "./EmployerOnboardingTaskList";

const SUGGESTED_WORKERS = [
  {
    name: "Maria Santos, CNA",
    detail: "5 yrs experience · Austin, TX",
    initials: "MS",
  },
  {
    name: "James Chen, RN",
    detail: "ICU certified · Available this week",
    initials: "JC",
  },
  {
    name: "Aisha Patel, LPN",
    detail: "Home health · 4.9 rating",
    initials: "AP",
  },
];

const HIRING_TIPS = [
  { title: "Post within 48 hours", detail: "Jobs posted early get 3× more applicants" },
  { title: "Add pay transparency", detail: "List hourly range to attract verified workers" },
  { title: "Verify your business", detail: "Complete onboarding to boost trust" },
];

export function EmployerHomeRightRail() {
  return (
    <aside className="space-y-2">
      <EmployerOnboardingTaskList />

      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-800">Hiring insights</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {HIRING_TIPS.map((tip) => (
            <li key={tip.title} className="px-4 py-3">
              <p className="text-xs font-bold text-zinc-800">{tip.title}</p>
              <p className="mt-0.5 text-[11px] leading-5 text-zinc-500">{tip.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-800">Suggested workers</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {SUGGESTED_WORKERS.map((worker) => (
            <li key={worker.name} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">
                {worker.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-zinc-800">{worker.name}</p>
                <p className="truncate text-[11px] text-zinc-500">{worker.detail}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full border border-zinc-400 px-3 py-1 text-[10px] font-bold uppercase text-zinc-600 transition hover:border-[#1db954] hover:text-[#1db954]"
              >
                Invite
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-zinc-100 px-4 py-3">
          <Link
            href="/worker/jobs"
            className="text-xs font-bold text-zinc-600 hover:text-[#1db954]"
          >
            View all workers →
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-300/60 bg-white px-4 py-3 text-center shadow-sm">
        <p className="text-[10px] leading-5 text-zinc-400">
          <Link href="#" className="hover:underline">About</Link>
          {" · "}
          <Link href="#" className="hover:underline">Help</Link>
          {" · "}
          <Link href="#" className="hover:underline">Privacy</Link>
        </p>
        <p className="mt-1 text-[10px] text-zinc-400">MyHiredito © 2026</p>
      </div>
    </aside>
  );
}
