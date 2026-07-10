"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AuthShell,
  authButtonClass,
  authErrorClass,
  authFieldClass,
  authLabelClass,
} from "@/app/components/auth/AuthShell";
import { signUpWithRole } from "@/app/lib/supabase/auth";
import { isSupabaseConfigured } from "@/app/lib/supabaseClient";
import { resetEmployerOnboarding } from "@/app/lib/employerOnboarding";
import { notifyEmployerAuthChange } from "@/app/lib/employerAuth";

export default function EmployerSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length >= 8 && agree && !loading;
  }, [agree, email, loading, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Add keys to .env.local.");
      }

      const data = await signUpWithRole({
        email,
        password,
        role: "employer",
        nextPath: "/employer/dashboard",
      });

      if (data.user?.id) {
        resetEmployerOnboarding(data.user.id);
      }

      if (data.user && !data.session) {
        setMessage("Account created. Check your email to confirm, then log in.");
        return;
      }

      notifyEmployerAuthChange();
      router.push("/employer/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell variant="employer" mode="signup">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="employer-signup-email" className={authLabelClass}>
            Work email
          </label>
          <input
            id="employer-signup-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authFieldClass}
            placeholder="you@company.com"
            required
          />
        </div>

        <div>
          <label htmlFor="employer-signup-password" className={authLabelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="employer-signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${authFieldClass} pr-16`}
              placeholder="8+ characters"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-zinc-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">
            Use at least 8 characters with letters and numbers.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#1db954] focus:ring-[#1db954]"
          />
          <span>
            I agree to the{" "}
            <Link href="#" className="font-semibold text-zinc-900 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-semibold text-zinc-900 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && <div className={authErrorClass}>{error}</div>}
        {message && (
          <div className="rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)] px-4 py-3 text-sm text-[var(--brand-dark)]">
            {message}
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className={authButtonClass}>
          {loading ? "Creating account..." : "Create Employer Account"}
        </button>

        <p className="text-center text-xs leading-5 text-zinc-400">
          Complete onboarding after signup to verify your business and post jobs.
        </p>
      </form>
    </AuthShell>
  );
}

