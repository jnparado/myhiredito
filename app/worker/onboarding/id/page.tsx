"use client";

import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  OnboardingStepForm,
  OnboardingStepLayout,
} from "../../../components/worker/OnboardingStepLayout";

export default function IdOnboardingPage() {
  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="government-id"
        title="Upload government ID"
        description="We use your ID to confirm your identity before you can apply for verified jobs."
      >
        <OnboardingStepForm stepId="government-id">
          <div>
            <label htmlFor="id-type" className={authLabelClass}>
              ID type
            </label>
            <select id="id-type" name="idType" className={authFieldClass} required>
              <option value="">Select ID type</option>
              <option value="drivers-license">Driver&apos;s license</option>
              <option value="passport">Passport</option>
              <option value="national-id">National ID card</option>
              <option value="state-id">State ID</option>
            </select>
          </div>

          <div>
            <label htmlFor="id-number" className={authLabelClass}>
              ID number
            </label>
            <input
              id="id-number"
              name="idNumber"
              className={authFieldClass}
              placeholder="Enter the number on your ID"
              required
            />
          </div>

          <div>
            <label htmlFor="id-expiry" className={authLabelClass}>
              Expiration date
            </label>
            <input
              id="id-expiry"
              name="idExpiry"
              type="date"
              className={authFieldClass}
              required
            />
          </div>

          <div>
            <label htmlFor="id-front" className={authLabelClass}>
              Upload ID (front)
            </label>
            <input
              id="id-front"
              name="idFront"
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-[var(--brand-light)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand-dark)] hover:file:bg-[var(--brand)]/20"
              required
            />
          </div>

          <div>
            <label htmlFor="id-back" className={authLabelClass}>
              Upload ID (back)
            </label>
            <input
              id="id-back"
              name="idBack"
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-[var(--brand-light)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand-dark)] hover:file:bg-[var(--brand)]/20"
            />
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            Your ID is encrypted and only used for identity verification. It is
            never shared with employers without your consent.
          </p>
        </OnboardingStepForm>
      </OnboardingStepLayout>
    </WorkerAccountShell>
  );
}
