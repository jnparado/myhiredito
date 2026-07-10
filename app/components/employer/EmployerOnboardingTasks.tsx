"use client";

import { useEffect, useState } from "react";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import {
  completeEmployerOnboardingStep,
  dismissEmployerOnboarding,
  EMPLOYER_BUSINESS_TYPES,
  EMPLOYER_HIRING_ROLE_OPTIONS,
  EMPLOYER_ID_TYPES,
  EMPLOYER_INDUSTRY_OPTIONS,
  EMPLOYER_ONBOARDING_STEPS,
  reopenEmployerOnboarding,
  type EmployerOnboardingStepId,
} from "@/app/lib/employerOnboarding";
import {
  getEmployerCompanyName,
  getEmployerDisplayName,
} from "@/app/lib/employerAuth";

const fieldClass =
  "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]";

const selectClass = `${fieldClass} bg-white`;

function StepStatus({
  complete,
  active,
}: {
  complete: boolean;
  active: boolean;
}) {
  if (complete) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
        ✓
      </span>
    );
  }

  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
        active
          ? "bg-red-500 text-white"
          : "border border-zinc-300 bg-white text-zinc-500"
      }`}
    >
      !
    </span>
  );
}

export function EmployerOnboardingAlert() {
  const { state, loading, isComplete, completedCount } = useEmployerOnboarding();

  if (loading || !state || isComplete) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            !
          </span>
          <div>
            <p className="text-sm font-semibold text-red-700">
              {state.dismissed
                ? "Onboarding skipped — your employer account is not verified"
                : "Employer onboarding incomplete — finish setup to post jobs"}
            </p>
            <p className="mt-1 text-sm text-red-600/90">
              {completedCount} of 3 steps done. Submit your government ID,
              business certificate, and company details.
            </p>
          </div>
        </div>
        {state.dismissed && (
          <button
            type="button"
            onClick={() => reopenEmployerOnboarding()}
            className="rounded border border-red-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-red-100"
          >
            Resume onboarding
          </button>
        )}
      </div>
    </div>
  );
}

export function EmployerOnboardingTasks() {
  const { user } = useEmployerAuth();
  const { state, loading, isComplete, completedCount, needsAttention } =
    useEmployerOnboarding();
  const [activeStep, setActiveStep] =
    useState<EmployerOnboardingStepId>("identity");

  const [identityForm, setIdentityForm] = useState({
    legalName: "",
    idType: EMPLOYER_ID_TYPES[0] as string,
    idNumber: "",
    dateOfBirth: "",
    idDocumentLabel: "",
  });

  const [certificateForm, setCertificateForm] = useState({
    legalBusinessName: "",
    businessType: EMPLOYER_BUSINESS_TYPES[0] as string,
    registrationNumber: "",
    taxId: "",
    yearEstablished: "",
    certificateLabel: "",
  });

  const [detailsForm, setDetailsForm] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    industry: EMPLOYER_INDUSTRY_OPTIONS[0] as string,
    contactPhone: "",
    website: "",
    hiringRoles: [] as string[],
    locationsCount: "1",
    notes: "",
  });

  useEffect(() => {
    if (!user) return;
    const legalName = getEmployerDisplayName(user);
    const businessName = getEmployerCompanyName(user);
    setIdentityForm((prev) => ({
      ...prev,
      legalName: prev.legalName || legalName,
    }));
    setCertificateForm((prev) => ({
      ...prev,
      legalBusinessName: prev.legalBusinessName || businessName,
    }));
  }, [user]);

  useEffect(() => {
    if (!state) return;
    if (state.data.identity) setIdentityForm(state.data.identity);
    if (state.data.businessCertificate)
      setCertificateForm(state.data.businessCertificate);
    if (state.data.businessDetails) setDetailsForm(state.data.businessDetails);

    const nextIncomplete = EMPLOYER_ONBOARDING_STEPS.find(
      (step) => !state.completedSteps.includes(step.id),
    );
    if (nextIncomplete) setActiveStep(nextIncomplete.id);
  }, [state]);

  if (loading || !state) {
    return (
      <div className="rounded border border-zinc-200 bg-white p-4 text-sm text-zinc-500 shadow-sm">
        Loading onboarding...
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="overflow-hidden rounded border border-[var(--brand)]/30 bg-[var(--brand-light)] shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)] text-xs text-white">
              ✓
            </span>
            <h2 className="text-sm font-bold text-[var(--brand-dark)]">
              Employer onboarding complete
            </h2>
          </div>
          <p className="mt-2 text-sm text-[var(--brand-dark)]/80">
            Your business is verified. You can post jobs and review applicants.
          </p>
        </div>
      </div>
    );
  }

  if (state.dismissed) {
    return (
      <div className="overflow-hidden rounded border border-red-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-red-100 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Incomplete
            </span>
            <h2 className="text-sm font-bold text-red-700">Onboarding skipped</h2>
          </div>
          <button
            type="button"
            onClick={() => reopenEmployerOnboarding()}
            className="text-xs font-bold uppercase tracking-wide text-red-600 hover:text-red-800"
          >
            Resume
          </button>
        </div>
        <p className="px-4 py-3 text-sm text-red-600">
          {completedCount} of 3 steps done. Complete verification to post jobs
          and hire workers.
        </p>
      </div>
    );
  }

  function toggleHiringRole(role: string) {
    setDetailsForm((prev) => ({
      ...prev,
      hiringRoles: prev.hiringRoles.includes(role)
        ? prev.hiringRoles.filter((item) => item !== role)
        : [...prev.hiringRoles, role],
    }));
  }

  function handleSaveStep(stepId: EmployerOnboardingStepId) {
    if (!state) return;

    if (stepId === "identity") {
      completeEmployerOnboardingStep("identity", identityForm);
    } else if (stepId === "business-certificate") {
      completeEmployerOnboardingStep("business-certificate", certificateForm);
    } else {
      completeEmployerOnboardingStep("business-details", detailsForm);
    }

    const updatedSteps = state.completedSteps.includes(stepId)
      ? state.completedSteps
      : [...state.completedSteps, stepId];

    const next = EMPLOYER_ONBOARDING_STEPS.find(
      (step) => !updatedSteps.includes(step.id),
    );
    if (next) setActiveStep(next.id);
  }

  return (
    <div
      className={`overflow-hidden rounded border bg-white shadow-sm ${
        needsAttention ? "border-red-300" : "border-zinc-200"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${
          needsAttention
            ? "border-red-100 bg-red-50"
            : "border-zinc-100 bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
            />
          </svg>
          <div>
            <h2 className="text-sm font-bold text-zinc-800">
              Employer onboarding
            </h2>
            <p className="text-xs text-zinc-500">
              Step {Math.min(completedCount + 1, 3)} of 3
            </p>
          </div>
          {needsAttention && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Action needed
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => dismissEmployerOnboarding()}
          className="rounded border border-zinc-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-600 transition hover:bg-zinc-100"
        >
          Skip
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all ${
              needsAttention ? "bg-red-500" : "bg-[var(--brand)]"
            }`}
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>

        <ul className="divide-y divide-zinc-100">
          {EMPLOYER_ONBOARDING_STEPS.map((step) => {
            const done = state.completedSteps.includes(step.id);
            const active = activeStep === step.id && !done;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`flex w-full items-center justify-between py-3 text-left transition ${
                    active ? "bg-red-50/60" : "hover:bg-zinc-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <StepStatus complete={done} active={active && !done} />
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                        Step {step.step}
                      </span>
                      <span
                        className={`block text-sm font-semibold ${
                          active && !done ? "text-red-700" : "text-zinc-800"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {step.subtitle}
                      </span>
                    </span>
                  </span>
                  <svg
                    className={`h-4 w-4 shrink-0 ${
                      active ? "text-red-400" : "text-zinc-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>

                {active && !done && (
                  <div className="border-t border-zinc-100 bg-zinc-50 px-1 py-4">
                    {step.id === "identity" && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                          Legal full name (authorized representative)
                          <input
                            className={fieldClass}
                            value={identityForm.legalName}
                            onChange={(e) =>
                              setIdentityForm((prev) => ({
                                ...prev,
                                legalName: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          ID type
                          <select
                            className={selectClass}
                            value={identityForm.idType}
                            onChange={(e) =>
                              setIdentityForm((prev) => ({
                                ...prev,
                                idType: e.target.value,
                              }))
                            }
                          >
                            {EMPLOYER_ID_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          ID number
                          <input
                            className={fieldClass}
                            value={identityForm.idNumber}
                            onChange={(e) =>
                              setIdentityForm((prev) => ({
                                ...prev,
                                idNumber: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Date of birth
                          <input
                            className={fieldClass}
                            type="date"
                            value={identityForm.dateOfBirth}
                            onChange={(e) =>
                              setIdentityForm((prev) => ({
                                ...prev,
                                dateOfBirth: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                          ID document reference
                          <input
                            className={fieldClass}
                            placeholder="e.g. drivers-license-front.pdf"
                            value={identityForm.idDocumentLabel}
                            onChange={(e) =>
                              setIdentityForm((prev) => ({
                                ...prev,
                                idDocumentLabel: e.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>
                    )}

                    {step.id === "business-certificate" && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                          Legal business name
                          <input
                            className={fieldClass}
                            value={certificateForm.legalBusinessName}
                            onChange={(e) =>
                              setCertificateForm((prev) => ({
                                ...prev,
                                legalBusinessName: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Business type
                          <select
                            className={selectClass}
                            value={certificateForm.businessType}
                            onChange={(e) =>
                              setCertificateForm((prev) => ({
                                ...prev,
                                businessType: e.target.value,
                              }))
                            }
                          >
                            {EMPLOYER_BUSINESS_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Year established
                          <input
                            className={fieldClass}
                            placeholder="2018"
                            value={certificateForm.yearEstablished}
                            onChange={(e) =>
                              setCertificateForm((prev) => ({
                                ...prev,
                                yearEstablished: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Business registration number
                          <input
                            className={fieldClass}
                            value={certificateForm.registrationNumber}
                            onChange={(e) =>
                              setCertificateForm((prev) => ({
                                ...prev,
                                registrationNumber: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Tax ID / EIN
                          <input
                            className={fieldClass}
                            placeholder="XX-XXXXXXX"
                            value={certificateForm.taxId}
                            onChange={(e) =>
                              setCertificateForm((prev) => ({
                                ...prev,
                                taxId: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                          Business certificate reference
                          <input
                            className={fieldClass}
                            placeholder="e.g. certificate-of-incorporation.pdf"
                            value={certificateForm.certificateLabel}
                            onChange={(e) =>
                              setCertificateForm((prev) => ({
                                ...prev,
                                certificateLabel: e.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>
                    )}

                    {step.id === "business-details" && (
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-zinc-600">
                          Business address
                          <input
                            className={fieldClass}
                            value={detailsForm.address}
                            onChange={(e) =>
                              setDetailsForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <label className="block text-xs font-semibold text-zinc-600">
                            City
                            <input
                              className={fieldClass}
                              value={detailsForm.city}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className="block text-xs font-semibold text-zinc-600">
                            State
                            <input
                              className={fieldClass}
                              value={detailsForm.state}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  state: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className="block text-xs font-semibold text-zinc-600">
                            ZIP
                            <input
                              className={fieldClass}
                              value={detailsForm.zip}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  zip: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-xs font-semibold text-zinc-600">
                            Industry
                            <select
                              className={selectClass}
                              value={detailsForm.industry}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  industry: e.target.value,
                                }))
                              }
                            >
                              {EMPLOYER_INDUSTRY_OPTIONS.map((industry) => (
                                <option key={industry} value={industry}>
                                  {industry}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="block text-xs font-semibold text-zinc-600">
                            Number of locations
                            <select
                              className={selectClass}
                              value={detailsForm.locationsCount}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  locationsCount: e.target.value,
                                }))
                              }
                            >
                              {["1", "2-5", "6-20", "21+"].map((count) => (
                                <option key={count} value={count}>
                                  {count}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="block text-xs font-semibold text-zinc-600">
                            Contact phone
                            <input
                              className={fieldClass}
                              type="tel"
                              value={detailsForm.contactPhone}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  contactPhone: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className="block text-xs font-semibold text-zinc-600">
                            Company website
                            <input
                              className={fieldClass}
                              type="url"
                              placeholder="https://"
                              value={detailsForm.website}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  website: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-600">
                            Roles you plan to hire
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {EMPLOYER_HIRING_ROLE_OPTIONS.map((role) => {
                              const selected = detailsForm.hiringRoles.includes(role);
                              return (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => toggleHiringRole(role)}
                                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                    selected
                                      ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)]"
                                      : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
                                  }`}
                                >
                                  {role}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Additional notes (optional)
                          <textarea
                            className={`${fieldClass} min-h-[72px] resize-y`}
                            placeholder="Hiring volume, compliance needs, preferred start dates..."
                            value={detailsForm.notes}
                            onChange={(e) =>
                              setDetailsForm((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveStep(step.id)}
                      className="mt-4 w-full rounded bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
                    >
                      Save &amp; continue
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
