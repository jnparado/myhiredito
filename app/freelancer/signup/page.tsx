"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function FreelancerSignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      email.trim().length > 0 &&
      password.trim().length >= 8 &&
      agree
    );
  }, [agree, email, fullName, password]);

  return (
    <main className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
            <div className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Create freelancer account
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/freelancer/login"
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                Log in
              </Link>
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit) return;
                alert("Signup submitted (connect this to your auth backend).");
              }}
            >
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  htmlFor="fullName"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                  placeholder="Your name"
                  required
                />
              </div>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 pr-20 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-white/10 dark:bg-black dark:text-zinc-50"
                    placeholder="At least 8 characters"
                    minLength={8}
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
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Use 8+ characters for better security.
                </p>
              </div>

              <label className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-black/20 text-[var(--brand)] focus:ring-[var(--brand)] dark:border-white/20"
                />
                <span>
                  I agree to the Terms and Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Sign up
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Want to hire instead?{" "}
            <Link
              href="/worker"
              className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Go to Worker
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

