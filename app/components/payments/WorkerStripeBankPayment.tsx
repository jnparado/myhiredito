"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { PaymentProviderPicker } from "@/app/components/payments/PaymentProviderPicker";
import { StripeBankConnect } from "@/app/components/payments/StripeBankConnect";
import { WalletConnectForm } from "@/app/components/payments/WalletConnectForm";
import { useStripeBankReturn } from "@/app/hooks/useStripeBankReturn";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { getWorkerEmail } from "@/app/lib/workerAuth";
import {
  savePaymentFromStripeBank,
  savePaymentFromWallet,
} from "@/app/lib/workerOnboarding";
import type { PaymentProvider } from "@/app/lib/payments/providers";
import type { StripeBankDetails } from "@/app/lib/stripe/bank";

export function WorkerStripeBankPayment() {
  const router = useRouter();
  const { user } = useWorkerAuth();
  const { userKey, progress } = useWorkerOnboarding();
  const email = user ? getWorkerEmail(user) : "";
  const alreadyConnected = progress.completedSteps.includes("payment-method");
  const [provider, setProvider] = useState<PaymentProvider>("bank");

  const finish = useCallback(() => {
    router.push("/worker/dashboard");
    router.refresh();
  }, [router]);

  const handleConnected = useCallback(
    async (bank: StripeBankDetails) => {
      if (!user || !userKey) return;
      await savePaymentFromStripeBank(user, userKey, bank);
      finish();
    },
    [finish, user, userKey],
  );

  const { status, error } = useStripeBankReturn(handleConnected);

  return (
    <div className="space-y-4">
      {alreadyConnected && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          A payout method is already connected. You can switch to Bank, Stripe,
          PayPal, or Wise if you need to update it.
        </div>
      )}

      <PaymentProviderPicker value={provider} onChange={setProvider} />

      {status === "saving" && (
        <p className="text-sm text-zinc-500">Saving your payout method...</p>
      )}
      {status === "cancel" && (
        <p className="text-sm text-amber-700">
          Setup was canceled. You can try again below.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {provider === "bank" && (
        <StripeBankConnect
          role="worker"
          email={email}
          returnPath="/worker/onboarding/payment"
          method="bank"
          onConnected={handleConnected}
        />
      )}
      {provider === "stripe" && (
        <StripeBankConnect
          role="worker"
          email={email}
          returnPath="/worker/onboarding/payment"
          method="card"
          onConnected={handleConnected}
        />
      )}
      {(provider === "paypal" || provider === "wise") && (
        <WalletConnectForm
          provider={provider}
          defaultEmail={email}
          onSave={async (handle) => {
            if (!user || !userKey) return;
            await savePaymentFromWallet(user, userKey, { provider, handle });
            finish();
          }}
        />
      )}
      <p className="text-xs leading-5 text-zinc-500">
        Bank and Stripe open a secure checkout. PayPal and Wise save the email
        you use for payouts.
      </p>
    </div>
  );
}
