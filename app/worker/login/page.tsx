"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSupabaseClient } from "@/app/lib/supabaseClient";

export default function WorkerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0 && !loading,
    [email, password, loading],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      router.push("/worker");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-black">
      <div className="mx-auto flex w-full max-w-lg flex-1 items-start justify-center px-6 py-14 sm:items-center">
        <div className="w-full">
          <div className="text-center">
            <div className="flex items-end justify-center gap-8">
              <div className="text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">
                Log In
              </div>
              <Link
                href="/worker/signup"
                className="pb-2 text-2xl font-black tracking-tight text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 sm:text-3xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <form className="mt-10 space-y-4" onSubmit={onSubmit}>
            <input
              aria-label="Email Address"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-none border border-black/10 bg-white px-5 text-base text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-white/10 dark:bg-black dark:text-zinc-50"
              placeholder="Email Address"
              required
            />

            <div className="relative">
              <input
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-none border border-black/10 bg-white px-5 pr-24 text-base text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-4 inline-flex h-14 w-full items-center justify-center bg-[var(--brand)] text-base font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Hiring instead?{" "}
              <Link
                href="/employer/login"
                className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
              >
                Employer login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

