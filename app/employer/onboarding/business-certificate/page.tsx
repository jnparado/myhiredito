"use client";

import { EmployerAccountShell } from "@/app/components/employer/EmployerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  EmployerOnboardingStepForm,
  EmployerOnboardingStepLayout,
} from "@/app/components/employer/EmployerOnboardingStepLayout";
import { EMPLOYER_BUSINESS_TYPES } from "@/app/lib/employerOnboarding";

export default function EmployerBusinessCertificatePage() {
  return (
    <EmployerAccountShell>
      <EmployerOnboardingStepLayout
        stepId="business-certificate"
        title="Business certificate & registration"
        description="Provide your legal entity details and upload proof of business registration, such as articles of incorporation or a business license."
      >
        <EmployerOnboardingStepForm stepId="business-certificate">
          <div>
            <label htmlFor="legal-business-name" className={authLabelClass}>
              Legal business name
            </label>
            <input
              id="legal-business-name"
              name="legalBusinessName"
              className={authFieldClass}
              placeholder="Registered legal name of your company"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="business-type" className={authLabelClass}>
                Business type
              </label>
              <select
                id="business-type"
                name="businessType"
                className={authFieldClass}
                required
              >
                <option value="">Select type</option>
                {EMPLOYER_BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year-established" className={authLabelClass}>
                Year established
              </label>
              <input
                id="year-established"
                name="yearEstablished"
                className={authFieldClass}
                placeholder="2018"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="registration-number" className={authLabelClass}>
                Business registration number
              </label>
              <input
                id="registration-number"
                name="registrationNumber"
                className={authFieldClass}
                placeholder="State or federal registration #"
                required
              />
            </div>

            <div>
              <label htmlFor="tax-id" className={authLabelClass}>
                Tax ID / EIN
              </label>
              <input
                id="tax-id"
                name="taxId"
                className={authFieldClass}
                placeholder="XX-XXXXXXX"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="certificate" className={authLabelClass}>
              Upload business certificate
            </label>
            <input
              id="certificate"
              name="certificateLabel"
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-[var(--brand-light)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand-dark)] hover:file:bg-[var(--brand)]/20"
              required
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Articles of incorporation, business license, or certificate of good standing.
            </p>
          </div>
        </EmployerOnboardingStepForm>
      </EmployerOnboardingStepLayout>
    </EmployerAccountShell>
  );
}
