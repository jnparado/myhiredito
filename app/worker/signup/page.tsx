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
import { getSupabaseClient } from "@/app/lib/supabaseClient";
import { resetWorkerOnboarding } from "@/app/lib/workerOnboarding";

export default function WorkerSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length >= 8 && agree && !loading,
    [agree, email, loading, password],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "worker" } },
      });
      if (authError) throw authError;
      resetWorkerOnboarding(email.trim().toLowerCase());
      router.push("/worker/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell variant="worker" mode="signup">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="worker-signup-email" className={authLabelClass}>
            Email
          </label>
          <input
            id="worker-signup-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authFieldClass}
            placeholder="you@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="worker-signup-password" className={authLabelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="worker-signup-password"
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

        <button type="submit" disabled={!canSubmit} className={authButtonClass}>
          {loading ? "Creating account..." : "Create Worker Account"}
        </button>

        <p className="text-center text-xs leading-5 text-zinc-400">
          Get verified, then start picking up shifts in your market.
        </p>
      </form>
    </AuthShell>
  );
}
