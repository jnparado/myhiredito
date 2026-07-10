"use client";

import Link from "next/link";
import { useState } from "react";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  getSuggestedWorkers,
  inviteWorker,
} from "@/app/lib/employerWorkers";
import { EmployerOnboardingTaskList } from "./EmployerOnboardingTaskList";

const HIRING_TIPS = [
  { title: "Post within 48 hours", detail: "Jobs posted early get 3× more applicants" },
  { title: "Add pay transparency", detail: "List hourly range to attract verified workers" },
  { title: "Verify your business", detail: "Complete onboarding to boost trust" },
];

export function EmployerHomeRightRail() {
  const { user } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const suggested = userKey ? getSuggestedWorkers(userKey) : [];
  const [invited, setInvited] = useState<string | null>(null);

  function handleInvite(worker: (typeof suggested)[number]) {
    if (!userKey) return;
    inviteWorker(userKey, worker);
    setInvited(worker.name);
    setTimeout(() => setInvited(null), 2000);
  }

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
        {invited && (
          <p className="border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
            Invited {invited}!
          </p>
        )}
        <ul className="divide-y divide-zinc-100">
          {suggested.length === 0 ? (
            <li className="px-4 py-4 text-xs text-zinc-500">
              All suggested workers invited.{" "}
              <Link href="/employer/workers" className="font-bold text-[#1db954]">
                View roster
              </Link>
            </li>
          ) : (
            suggested.map((worker) => (
              <li key={worker.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">
                  {worker.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-zinc-800">
                    {worker.name}, {worker.role}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">{worker.skills}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInvite(worker)}
                  className="shrink-0 rounded-full border border-zinc-400 px-3 py-1 text-[10px] font-bold uppercase text-zinc-600 transition hover:border-[#1db954] hover:text-[#1db954]"
                >
                  Invite
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-zinc-100 px-4 py-3">
          <Link
            href="/employer/workers"
            className="text-xs font-bold text-zinc-600 hover:text-[#1db954]"
          >
            View all workers →
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-300/60 bg-white px-4 py-3 text-center shadow-sm">
        <p className="text-[10px] leading-5 text-zinc-400">
          <Link href="/employer" className="hover:underline">About</Link>
          {" · "}
          <Link href="/employer/reports" className="hover:underline">Help</Link>
          {" · "}
          <Link href="/employer/profile" className="hover:underline">Privacy</Link>
        </p>
        <p className="mt-1 text-[10px] text-zinc-400">MyHiredito © 2026</p>
      </div>
    </aside>
  );
}
