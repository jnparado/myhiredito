"use client";

import { EmployerAccountShell } from "@/app/components/employer/EmployerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  EmployerOnboardingStepForm,
  EmployerOnboardingStepLayout,
} from "@/app/components/employer/EmployerOnboardingStepLayout";
import { EMPLOYER_ID_TYPES } from "@/app/lib/employerOnboarding";

export default function EmployerIdOnboardingPage() {
  return (
    <EmployerAccountShell>
      <EmployerOnboardingStepLayout
        stepId="identity"
        title="Government ID verification"
        description="Verify the authorized representative who manages hiring for your organization. Upload a valid government-issued ID."
      >
        <EmployerOnboardingStepForm stepId="identity">
          <div>
            <label htmlFor="legal-name" className={authLabelClass}>
              Legal full name (authorized representative)
            </label>
            <input
              id="legal-name"
              name="legalName"
              className={authFieldClass}
              placeholder="Full legal name as shown on ID"
              required
            />
          </div>

          <div>
            <label htmlFor="id-type" className={authLabelClass}>
              ID type
            </label>
            <select id="id-type" name="idType" className={authFieldClass} required>
              <option value="">Select ID type</option>
              {EMPLOYER_ID_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
            <label htmlFor="date-of-birth" className={authLabelClass}>
              Date of birth
            </label>
            <input
              id="date-of-birth"
              name="dateOfBirth"
              type="date"
              className={authFieldClass}
              required
            />
          </div>

          <div>
            <label htmlFor="id-document" className={authLabelClass}>
              Upload government ID
            </label>
            <input
              id="id-document"
              name="idDocumentLabel"
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-[var(--brand-light)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand-dark)] hover:file:bg-[var(--brand)]/20"
              required
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Accepted: driver&apos;s license, passport, or national ID (PDF or image).
            </p>
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            Your ID is encrypted and used only to verify the authorized representative.
            It is never shared with workers without your consent.
          </p>
        </EmployerOnboardingStepForm>
      </EmployerOnboardingStepLayout>
    </EmployerAccountShell>
  );
}
