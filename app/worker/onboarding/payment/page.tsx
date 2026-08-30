"use client";

import { Suspense } from "react";
import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import { OnboardingStepLayout } from "../../../components/worker/OnboardingStepLayout";
import { WorkerStripeBankPayment } from "../../../components/payments/WorkerStripeBankPayment";

export default function PaymentOnboardingPage() {
  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="payment-method"
        title="Add payment method"
        description="Choose Bank, Stripe, PayPal, or Wise so you can receive pay after completed shifts."
      >
        <Suspense
          fallback={
            <p className="text-sm text-zinc-500">Loading Stripe bank setup...</p>
          }
        >
          <WorkerStripeBankPayment />
        </Suspense>
      </OnboardingStepLayout>
    </WorkerAccountShell>
  );
}
