"use client";

import { useState } from "react";
import { authFieldClass, authLabelClass } from "@/app/components/auth/AuthShell";
import type { PaymentProvider } from "@/app/lib/payments/providers";

type Props = {
  provider: Extract<PaymentProvider, "paypal" | "wise">;
  defaultEmail?: string;
  onSave: (handle: string) => void | Promise<void>;
};

export function WalletConnectForm({ provider, defaultEmail = "", onSave }: Props) {
  const [handle, setHandle] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const label = provider === "paypal" ? "PayPal" : "Wise";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = handle.trim().toLowerCase();
    if (!next.includes("@")) {
      setError(`Enter a valid ${label} email.`);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSave(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not save ${label}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={(e) => void onSubmit(e)}>
      <div>
        <label className={authLabelClass} htmlFor={`${provider}-email`}>
          {label} email
        </label>
        <input
          id={`${provider}-email`}
          type="email"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className={authFieldClass}
          placeholder={provider === "paypal" ? "name@paypal.com" : "name@wise.com"}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex h-12 w-full items-center justify-center rounded-lg text-sm font-bold uppercase tracking-wide text-white transition disabled:opacity-60 ${
          provider === "paypal"
            ? "bg-[#0070ba] hover:bg-[#005ea6]"
            : "bg-[#163300] hover:bg-[#0f2400]"
        }`}
      >
        {loading ? "Saving..." : `Connect ${label}`}
      </button>
    </form>
  );
}
