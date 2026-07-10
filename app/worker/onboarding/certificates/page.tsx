"use client";

import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  OnboardingStepForm,
  OnboardingStepLayout,
} from "../../../components/worker/OnboardingStepLayout";

export default function CertificatesOnboardingPage() {
  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="certificates"
        title="Add certificates & licenses"
        description="Upload professional credentials so employers can match you to the right roles."
      >
        <OnboardingStepForm stepId="certificates">
          <div>
            <label htmlFor="certificate-name" className={authLabelClass}>
              Certificate or license name
            </label>
            <input
              id="certificate-name"
              name="certificateName"
              className={authFieldClass}
              placeholder="CNA, RN, BLS, Forklift Operator"
              required
            />
          </div>

          <div>
            <label htmlFor="issuing-body" className={authLabelClass}>
              Issuing organization
            </label>
            <input
              id="issuing-body"
              name="issuingBody"
              className={authFieldClass}
              placeholder="State Board of Nursing, American Heart Association"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="issue-date" className={authLabelClass}>
                Issue date
              </label>
              <input
                id="issue-date"
                name="issueDate"
                type="date"
                className={authFieldClass}
                required
              />
            </div>
            <div>
              <label htmlFor="expiry-date" className={authLabelClass}>
                Expiration date
              </label>
              <input
                id="expiry-date"
                name="expiryDate"
                type="date"
                className={authFieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="license-number" className={authLabelClass}>
              License / certificate number
            </label>
            <input
              id="license-number"
              name="licenseNumber"
              className={authFieldClass}
              placeholder="Enter license or certificate ID"
              required
            />
          </div>

          <div>
            <label htmlFor="certificate-file" className={authLabelClass}>
              Upload certificate file
            </label>
            <input
              id="certificate-file"
              name="certificateFile"
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-[var(--brand-light)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand-dark)] hover:file:bg-[var(--brand)]/20"
              required
            />
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            You can add more certificates later from your profile. At least one
            credential is required to complete onboarding.
          </p>
        </OnboardingStepForm>
      </OnboardingStepLayout>
    </WorkerAccountShell>
  );
}
