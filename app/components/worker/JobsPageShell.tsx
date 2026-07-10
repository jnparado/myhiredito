"use client";

import Link from "next/link";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { MarketingNav } from "../marketing/MarketingNav";
import { WorkerShell } from "./WorkerShell";

export function JobsPageShell({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useWorkerAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50">
        <MarketingNav />
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Loading jobs...
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <WorkerShell>{children}</WorkerShell>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-sm text-zinc-500">
            Sign in to save jobs and apply faster.
          </p>
          <div className="flex gap-3">
            <Link
              href="/worker/login"
              className="rounded bg-[#0f1115] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-zinc-800"
            >
              Log In
            </Link>
            <Link
              href="/worker/signup"
              className="rounded border border-zinc-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-zinc-900 hover:bg-zinc-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
