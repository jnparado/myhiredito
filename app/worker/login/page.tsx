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
import {
  isDemoCredentials,
  setDemoWorkerSession,
  WORKER_DEMO_EMAIL,
  WORKER_DEMO_PASSWORD,
} from "@/app/lib/workerDemoAuth";

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
      if (isDemoCredentials(email, password)) {
        setDemoWorkerSession();
        router.push("/worker/dashboard");
        router.refresh();
        return;
      }

      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      router.push("/worker/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell variant="worker" mode="login">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="worker-login-email" className={authLabelClass}>
            Email
          </label>
          <input
            id="worker-login-email"
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
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="worker-login-password" className={authLabelClass}>
              Password
            </label>
            <Link
              href="#"
              className="text-[11px] font-semibold text-zinc-500 hover:text-[#1db954]"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              id="worker-login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${authFieldClass} pr-16`}
              placeholder="Your password"
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
        </div>

        {error && <div className={authErrorClass}>{error}</div>}

        <button type="submit" disabled={!canSubmit} className={authButtonClass}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          <p className="font-semibold text-zinc-800">Demo worker login</p>
          <p className="mt-1">
            Email: <span className="font-mono text-zinc-900">{WORKER_DEMO_EMAIL}</span>
          </p>
          <p>
            Password: <span className="font-mono text-zinc-900">{WORKER_DEMO_PASSWORD}</span>
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Use these credentials to preview the worker account UI without Supabase.
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
