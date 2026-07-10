"use client";

import { useState } from "react";
import { useEmployerWorkers } from "@/app/hooks/useEmployerWorkers";
import {
  getSuggestedWorkers,
  inviteWorker,
  saveWorkerToRoster,
  updateWorkerStatus,
  type WorkerRosterStatus,
} from "@/app/lib/employerWorkers";

const STATUS_LABELS: Record<WorkerRosterStatus, string> = {
  saved: "Saved",
  invited: "Invited",
  active: "Active",
  hired: "Hired",
};

export function EmployerWorkersView() {
  const { userKey, workers, loading } = useEmployerWorkers();
  const [tab, setTab] = useState<"roster" | "discover">("roster");
  const suggested = userKey ? getSuggestedWorkers(userKey) : [];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading workers...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Talent pool
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Workers</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your roster, invite workers, and track hiring relationships.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("roster")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${
            tab === "roster"
              ? "bg-[#1db954] text-white"
              : "border border-zinc-300 text-zinc-600"
          }`}
        >
          My roster ({workers.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("discover")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${
            tab === "discover"
              ? "bg-[#1db954] text-white"
              : "border border-zinc-300 text-zinc-600"
          }`}
        >
          Discover ({suggested.length})
        </button>
      </div>

      {tab === "roster" ? (
        workers.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-zinc-700">No workers in your roster yet</p>
            <button
              type="button"
              onClick={() => setTab("discover")}
              className="mt-4 rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Discover workers
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">
                      {worker.name}
                      <span className="ml-2 text-xs font-normal text-zinc-500">
                        {worker.role}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {worker.skills} · {worker.location} · ★ {worker.rating}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-600">
                    {STATUS_LABELS[worker.status]}
                  </span>
                  {userKey && worker.status === "invited" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateWorkerStatus(userKey, worker.id, "active")
                      }
                      className="rounded-lg bg-[#1db954] px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Mark active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {suggested.map((worker) => (
            <div
              key={worker.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600">
                  {worker.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-zinc-900">
                    {worker.name}
                    <span className="ml-2 text-xs font-normal text-zinc-500">
                      {worker.role}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {worker.skills} · {worker.location}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => userKey && saveWorkerToRoster(userKey, worker)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => userKey && inviteWorker(userKey, worker)}
                  className="rounded-lg bg-[#1db954] px-3 py-1.5 text-xs font-bold text-white"
                >
                  Invite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
