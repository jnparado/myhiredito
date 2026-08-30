"use client";

import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  OnboardingStepForm,
  OnboardingStepLayout,
} from "../../../components/worker/OnboardingStepLayout";
import { useWorkerAuth } from "../../../hooks/useWorkerAuth";
import { getWorkerDisplayName, getWorkerEmail } from "../../../lib/workerAuth";
import {
  isWorkerDemoAccount,
  WORKER_DEMO_CERTIFICATES,
} from "../../../lib/workerDemoAuth";

export default function SkillsCertificatesOnboardingPage() {
  const { user } = useWorkerAuth();
  const demo =
    !!user &&
    isWorkerDemoAccount(getWorkerEmail(user), getWorkerDisplayName(user));
  const defaults = demo ? WORKER_DEMO_CERTIFICATES : null;

  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="skills-certificates"
        title="Skills, experience & certificates"
        description="Share your work history, skills, and upload at least one professional credential."
      >
        <OnboardingStepForm stepId="skills-certificates">
          <div>
            <label htmlFor="years-experience" className={authLabelClass}>
              Years of experience
            </label>
            <input
              id="years-experience"
              name="yearsExperience"
              type="number"
              min={0}
              className={authFieldClass}
              placeholder="3"
              defaultValue={defaults?.yearsExperience ?? ""}
              required
            />
          </div>

          <div>
            <label htmlFor="skills" className={authLabelClass}>
              Skills & roles
            </label>
            <input
              id="skills"
              name="skills"
              className={authFieldClass}
              placeholder="CNA, Patient care, BLS certified"
              defaultValue={defaults?.skills ?? ""}
              required
            />
          </div>

          <div>
            <label htmlFor="work-history" className={authLabelClass}>
              Work experience
            </label>
            <textarea
              id="work-history"
              name="workHistory"
              rows={4}
              className={authFieldClass}
              placeholder="Summarize recent roles, employers, and responsibilities."
              defaultValue={defaults?.workHistory ?? ""}
              required
            />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-800">Certificate or license</p>
            <p className="mt-1 text-xs text-zinc-500">
              Upload at least one credential to verify your qualifications.
            </p>

            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor="certificate-name" className={authLabelClass}>
                  Certificate or license name
                </label>
                <input
                  id="certificate-name"
                  name="certificateName"
                  className={authFieldClass}
                  placeholder="CNA, RN, BLS, Forklift Operator"
                  defaultValue={defaults?.certificateName ?? ""}
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
                  defaultValue={defaults?.issuingBody ?? ""}
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
                    defaultValue={defaults?.issueDate ?? ""}
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
                    defaultValue={defaults?.expiryDate ?? ""}
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
                  defaultValue={defaults?.licenseNumber ?? ""}
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
                  required={!defaults}
                />
                {defaults && (
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Demo account already has {defaults.certificateName} on file.
                  </p>
                )}
              </div>
            </div>
          </div>
        </OnboardingStepForm>
      </OnboardingStepLayout>
    </WorkerAccountShell>
  );
}
