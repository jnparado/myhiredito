"use client";

import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  OnboardingStepForm,
  OnboardingStepLayout,
} from "../../../components/worker/OnboardingStepLayout";

export default function PaymentOnboardingPage() {
  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="payment-method"
        title="Add payment method"
        description="Connect a bank account or debit card so you can receive pay after completed shifts."
      >
        <OnboardingStepForm stepId="payment-method">
          <div>
            <label htmlFor="payment-method" className={authLabelClass}>
              Payment method
            </label>
            <select
              id="payment-method"
              name="paymentMethod"
              className={authFieldClass}
              required
            >
              <option value="">Select payment method</option>
              <option value="bank-account">Bank account (ACH)</option>
              <option value="debit-card">Debit card</option>
            </select>
          </div>

          <div>
            <label htmlFor="account-holder" className={authLabelClass}>
              Account holder name
            </label>
            <input
              id="account-holder"
              name="accountHolder"
              className={authFieldClass}
              placeholder="Name on bank account or card"
              required
            />
          </div>

          <div>
            <label htmlFor="account-last4" className={authLabelClass}>
              Last 4 digits
            </label>
            <input
              id="account-last4"
              name="accountLast4"
              className={authFieldClass}
              placeholder="1234"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              required
            />
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            Full account details are collected securely after onboarding. We only
            store a reference here to confirm your payout method is set up.
          </p>
        </OnboardingStepForm>
      </OnboardingStepLayout>
    </WorkerAccountShell>
  );
}
