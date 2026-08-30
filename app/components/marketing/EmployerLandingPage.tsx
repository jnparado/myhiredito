"use client";

import Link from "next/link";
import { MarketingNav } from "./MarketingNav";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";

export function EmployerLandingPage() {
  const { authenticated, loading } = useEmployerAuth();

  return (
    <main className="flex flex-1 flex-col">
      <MarketingNav />
      <div className="flex flex-1 flex-col bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm sm:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-zinc-700">
              Employer
            </div>

            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Hire the right freelancer, faster.
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-zinc-600">
              Post jobs, review applicants, and manage hiring from one dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {!loading && authenticated ? (
                <Link
                  href="/employer/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--brand)] px-8 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--brand-strong)]"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/employer/login"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-white hover:bg-zinc-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/employer/signup"
                    className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-zinc-900 hover:bg-zinc-100"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
