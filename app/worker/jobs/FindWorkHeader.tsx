"use client";

import Link from "next/link";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { getAllMarketplaceJobs } from "@/app/lib/jobCatalog";

export function FindWorkHeader() {
  const { authenticated, loading } = useWorkerAuth();
  const jobCount = getAllMarketplaceJobs().length;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-normal text-zinc-800 sm:text-2xl lg:text-3xl">
          Find work
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Browse {jobCount}+ open jobs on MyHiredito, LinkedIn, and Upwork.
        </p>
      </div>
      {!loading && !authenticated && (
        <Link
          href="/worker/signup"
          className="inline-flex h-10 items-center justify-center rounded bg-[var(--brand)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
        >
          Create profile
        </Link>
      )}
    </div>
  );
}
