"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { StripeBankConnect } from "@/app/components/payments/StripeBankConnect";
import { useStripeBankReturn } from "@/app/hooks/useStripeBankReturn";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { getWorkerEmail } from "@/app/lib/workerAuth";
import { savePaymentFromStripeBank } from "@/app/lib/workerOnboarding";
import type { StripeBankDetails } from "@/app/lib/stripe/bank";

export function WorkerStripeBankPayment() {
  const router = useRouter();
  const { user } = useWorkerAuth();
  const { userKey, progress } = useWorkerOnboarding();
  const email = user ? getWorkerEmail(user) : "";
  const alreadyConnected = progress.completedSteps.includes("payment-method");

  const handleConnected = useCallback(
    async (bank: StripeBankDetails) => {
      if (!user || !userKey) return;
      await savePaymentFromStripeBank(user, userKey, bank);
      router.push("/worker/dashboard");
      router.refresh();
    },
    [router, user, userKey],
  );

  const { status, error } = useStripeBankReturn(handleConnected);

  return (
    <div className="space-y-4">
      {alreadyConnected && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          A payout bank is already connected. You can connect a different account
          with Stripe if you need to update it.
        </div>
      )}

      {status === "saving" && (
        <p className="text-sm text-zinc-500">Saving your Stripe bank account...</p>
      )}
      {status === "cancel" && (
        <p className="text-sm text-amber-700">
          Stripe bank setup was canceled. You can try again below.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <StripeBankConnect
        role="worker"
        email={email}
        returnPath="/worker/onboarding/payment"
        onConnected={handleConnected}
      />
      <p className="text-xs leading-5 text-zinc-500">
        Stripe opens a secure checkout to link a US bank account for ACH payouts.
        We only store the bank name and last four digits.
      </p>
    </div>
  );
}
