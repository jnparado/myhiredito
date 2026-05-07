"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function FreelancerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password],
  );

  return (
    <main className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          <div className="hidden lg:block">
            <div className="rounded-3xl border border-black/10 bg-white p-10 shadow-sm dark:border-white/10 dark:bg-black">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
                Freelancer login
              </div>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Welcome back to MyHiredito.
              </h1>
              <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Sign in to apply to jobs, message clients, and manage your
                projects.
              </p>
              <div className="mt-8 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                  Faster applications with saved profile
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                  Secure messaging and payments
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                  Track your work in one place
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
              <div className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Log in
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                New here?{" "}
                <Link
                  href="/freelancer/signup"
                  className="font-semibold text-[var(--brand)] hover:underline"
                >
                  Create an account
                </Link>
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!canSubmit) return;
                  alert("Login submitted (connect this to your auth backend).");
                }}
              >
                <div className="space-y-1.5">
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 pr-20 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-black/20 text-[var(--brand)] focus:ring-[var(--brand)] dark:border-white/20"
                    />
                    Remember me
                  </label>
                  <Link
                    href="#"
                    className="text-sm font-semibold text-zinc-700 hover:underline dark:text-zinc-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Log in
                </button>

                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                  By continuing, you agree to our Terms and acknowledge our
                  Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

