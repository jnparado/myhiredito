"use client";

import Link from "next/link";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";

export function WorkerLandingAuthActions() {
  const { authenticated, loading } = useWorkerAuth();

  if (loading) {
    return (
      <div className="mt-6 h-12 w-64 animate-pulse rounded-lg bg-zinc-200" />
    );
  }

  if (authenticated) {
    return (
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/worker/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-zinc-800"
        >
          Go to dashboard
        </Link>
        <Link
          href="/worker/tracker"
          className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
        >
          Open tracker
        </Link>
        <Link
          href="/worker/jobs"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--brand)] px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[var(--brand-strong)]"
        >
          Browse jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/worker/login"
        className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-zinc-800"
      >
        Login
      </Link>
      <Link
        href="/worker/signup"
        className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
      >
        Signup
      </Link>
      <Link
        href="/worker/jobs"
        className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--brand)] px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[var(--brand-strong)]"
      >
        Browse Jobs
      </Link>
    </div>
  );
}
