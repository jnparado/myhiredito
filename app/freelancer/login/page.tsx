"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function SocialIcon({
  kind,
}: {
  kind: "facebook" | "google";
}) {
  const common =
    "h-12 w-12 rounded-full border-2 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-black dark:focus-visible:ring-offset-black";

  if (kind === "facebook") {
    return (
      <button
        type="button"
        className={`${common} border-[#3b5998]/40 text-[#3b5998]`}
        aria-label="Continue with Facebook"
        onClick={() => alert("Facebook login (connect to auth later).")}
      >
        <svg
          viewBox="0 0 24 24"
          className="mx-auto h-5 w-5"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06C2 17.08 5.657 21.24 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.523 1.49-3.917 3.77-3.917 1.092 0 2.238.196 2.238.196v2.476h-1.26c-1.243 0-1.63.776-1.63 1.57v1.89h2.773l-.443 2.91h-2.33V22C18.343 21.24 22 17.08 22 12.06Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${common} border-[#db4437]/40 text-[#db4437]`}
      aria-label="Continue with Google"
      onClick={() => alert("Google login (connect to auth later).")}
    >
      <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.35 11.1H12v2.98h5.35c-.23 1.2-.92 2.22-1.96 2.9v2.46h3.17c1.86-1.72 2.79-4.25 2.79-7.25 0-.69-.06-1.21-.18-1.84Z"
        />
        <path
          fill="currentColor"
          d="M12 22c2.7 0 4.97-.9 6.63-2.46l-3.17-2.46c-.88.59-2.01.94-3.46.94-2.64 0-4.88-1.78-5.68-4.18H3.04v2.53A10 10 0 0 0 12 22Z"
          opacity=".85"
        />
        <path
          fill="currentColor"
          d="M6.32 13.84A6 6 0 0 1 6 12c0-.64.11-1.26.32-1.84V7.63H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.37l3.28-2.53Z"
          opacity=".75"
        />
        <path
          fill="currentColor"
          d="M12 5.98c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.97 2.9 14.7 2 12 2A10 10 0 0 0 3.04 7.63l3.28 2.53c.8-2.4 3.04-4.18 5.68-4.18Z"
          opacity=".65"
        />
      </svg>
    </button>
  );
}

export default function FreelancerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password],
  );

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
                href="/freelancer/signup"
                className="pb-2 text-2xl font-black tracking-tight text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 sm:text-3xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <form
            className="mt-10 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              router.push("/freelancer/account");
            }}
          >
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

            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Forgot password?{" "}
              <Link
                href="#"
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                Reset it here
              </Link>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-4 inline-flex h-14 w-full items-center justify-center bg-[var(--brand)] text-base font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Log In
            </button>

            <div className="pt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Login with social network
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <SocialIcon kind="facebook" />
              <SocialIcon kind="google" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

