"use client";

import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";

export function WorkerDashboardGreeting() {
  const { user, loading } = useWorkerAuth();

  if (loading) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-normal text-zinc-800 sm:text-4xl">
          Hi there,
        </h1>
        <p className="mt-1 text-base text-zinc-500">
          Here&apos;s a snapshot of what&apos;s happening on your account
        </p>
      </div>
    );
  }

  const name = user ? getWorkerDisplayName(user).split(" ")[0] : "there";

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-normal text-zinc-800 sm:text-4xl">
        Hi {name},
      </h1>
      <p className="mt-1 text-base text-zinc-500">
        Here&apos;s a snapshot of what&apos;s happening on your account
      </p>
    </div>
  );
}
