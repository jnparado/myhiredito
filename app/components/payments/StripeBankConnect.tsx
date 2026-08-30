"use client";

import { useState } from "react";
import type { StripeBankDetails, StripeBankRole } from "@/app/lib/stripe/bank";

const DEMO_BANK: StripeBankDetails = {
  paymentMethodId: "pm_demo_bank",
  bankName: "Stripe Test Bank",
  last4: "6789",
  accountHolder: "Demo Account",
};

type Props = {
  role: StripeBankRole;
  email: string;
  returnPath: string;
  onConnected?: (bank: StripeBankDetails) => void | Promise<void>;
};

export function StripeBankConnect({
  role,
  email,
  returnPath,
  onConnected,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connectBank() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/bank-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, returnPath }),
      });
      const data = (await response.json()) as {
        configured?: boolean;
        url?: string;
        error?: string;
      };

      if (data.url) {
        window.location.assign(data.url);
        return;
      }

      if (response.status === 503 || data.configured === false) {
        await onConnected?.({
          ...DEMO_BANK,
          accountHolder: email.split("@")[0] || DEMO_BANK.accountHolder,
        });
        return;
      }

      throw new Error(data.error || "Could not start Stripe bank setup.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect bank.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void connectBank()}
        disabled={loading || !email}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#635bff] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#4b45c6] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <StripeMark />
        {loading ? "Opening Stripe..." : "Connect bank with Stripe"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

function StripeMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
    </svg>
  );
}
