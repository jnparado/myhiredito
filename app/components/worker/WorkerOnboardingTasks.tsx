"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import {
  completeOnboardingStep,
  dismissWorkerOnboarding,
  ONBOARDING_STEPS,
  reopenWorkerOnboarding,
  WORKER_SKILL_OPTIONS,
  type OnboardingStepId,
} from "@/app/lib/workerOnboarding";

const fieldClass =
  "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]";

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

export function WorkerOnboardingAlert() {
  const { state, loading, isComplete, completedCount } = useWorkerOnboarding();

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
                ? "Onboarding skipped — your account setup is not finished"
                : "Onboarding incomplete — finish setup to apply for jobs"}
            </p>
            <p className="mt-1 text-sm text-red-600/90">
              {completedCount} of 3 steps done. Add your personal info, location
              &amp; skills, and payment method.
            </p>
          </div>
        </div>
        {state.dismissed && (
          <button
            type="button"
            onClick={() => reopenWorkerOnboarding()}
            className="rounded border border-red-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-red-100"
          >
            Resume onboarding
          </button>
        )}
      </div>
    </div>
  );
}

export function WorkerOnboardingTasks() {
  const { user } = useWorkerAuth();
  const { state, loading, isComplete, completedCount, needsAttention } =
    useWorkerOnboarding();
  const [activeStep, setActiveStep] = useState<OnboardingStepId>("personal");

  const [personalForm, setPersonalForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [locationForm, setLocationForm] = useState({
    city: "",
    state: "",
    zip: "",
    skills: [] as string[],
  });
  const [paymentForm, setPaymentForm] = useState({
    method: "bank" as "bank" | "debit",
    accountLabel: "",
  });

  useEffect(() => {
    if (!user) return;
    const email =
      user.source === "demo" ? user.user.email : user.email;
    const firstName =
      user.source === "demo" ? user.user.firstName : user.displayName.split(" ")[0] ?? "";
    const lastName =
      user.source === "demo" ? user.user.lastName : user.displayName.split(" ").slice(1).join(" ");

    setPersonalForm((prev) => ({
      ...prev,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || lastName,
      email: prev.email || email,
    }));
  }, [user]);

  useEffect(() => {
    if (!state) return;
    if (state.data.personal) {
      setPersonalForm(state.data.personal);
    }
    if (state.data.locationSkills) {
      setLocationForm(state.data.locationSkills);
    }
    if (state.data.payment) {
      setPaymentForm(state.data.payment);
    }

    const nextIncomplete = ONBOARDING_STEPS.find(
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
              Onboarding complete
            </h2>
          </div>
          <p className="mt-2 text-sm text-[var(--brand-dark)]/80">
            Your profile is ready. You can apply to matched jobs now.
          </p>
          <Link
            href="/worker/jobs"
            className="mt-3 inline-flex text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            Browse jobs →
          </Link>
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
            onClick={() => reopenWorkerOnboarding()}
            className="text-xs font-bold uppercase tracking-wide text-red-600 hover:text-red-800"
          >
            Resume
          </button>
        </div>
        <p className="px-4 py-3 text-sm text-red-600">
          {completedCount} of 3 steps done. Finish onboarding to unlock job
          applications.
        </p>
      </div>
    );
  }

  function toggleSkill(skill: string) {
    setLocationForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((item) => item !== skill)
        : [...prev.skills, skill],
    }));
  }

  function handleSaveStep(stepId: OnboardingStepId) {
    if (!state) return;

    if (stepId === "personal") {
      completeOnboardingStep("personal", personalForm);
    } else if (stepId === "location-skills") {
      completeOnboardingStep("location-skills", locationForm);
    } else {
      completeOnboardingStep("payment", paymentForm);
    }

    const updatedSteps = state.completedSteps.includes(stepId)
      ? state.completedSteps
      : [...state.completedSteps, stepId];

    const next = ONBOARDING_STEPS.find(
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <div>
            <h2 className="text-sm font-bold text-zinc-800">
              Onboarding task list
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
          onClick={() => dismissWorkerOnboarding()}
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
          {ONBOARDING_STEPS.map((step) => {
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
                    {step.id === "personal" && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-semibold text-zinc-600">
                          First name
                          <input
                            className={fieldClass}
                            value={personalForm.firstName}
                            onChange={(e) =>
                              setPersonalForm((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600">
                          Last name
                          <input
                            className={fieldClass}
                            value={personalForm.lastName}
                            onChange={(e) =>
                              setPersonalForm((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                          Phone number
                          <input
                            className={fieldClass}
                            type="tel"
                            placeholder="(555) 555-0100"
                            value={personalForm.phone}
                            onChange={(e) =>
                              setPersonalForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                          Email
                          <input
                            className={`${fieldClass} bg-zinc-100`}
                            type="email"
                            value={personalForm.email}
                            readOnly
                          />
                        </label>
                      </div>
                    )}

                    {step.id === "location-skills" && (
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <label className="block text-xs font-semibold text-zinc-600">
                            City
                            <input
                              className={fieldClass}
                              value={locationForm.city}
                              onChange={(e) =>
                                setLocationForm((prev) => ({
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
                              value={locationForm.state}
                              onChange={(e) =>
                                setLocationForm((prev) => ({
                                  ...prev,
                                  state: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className="block text-xs font-semibold text-zinc-600">
                            ZIP code
                            <input
                              className={fieldClass}
                              value={locationForm.zip}
                              onChange={(e) =>
                                setLocationForm((prev) => ({
                                  ...prev,
                                  zip: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-600">
                            Skill set
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {WORKER_SKILL_OPTIONS.map((skill) => {
                              const selected = locationForm.skills.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => toggleSkill(skill)}
                                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                    selected
                                      ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)]"
                                      : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
                                  }`}
                                >
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {step.id === "payment" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {(["bank", "debit"] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() =>
                                setPaymentForm((prev) => ({ ...prev, method }))
                              }
                              className={`flex-1 rounded border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                paymentForm.method === method
                                  ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)]"
                                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
                              }`}
                            >
                              {method === "bank" ? "Bank account" : "Debit card"}
                            </button>
                          ))}
                        </div>
                        <label className="block text-xs font-semibold text-zinc-600">
                          {paymentForm.method === "bank"
                            ? "Account nickname"
                            : "Card nickname"}
                          <input
                            className={fieldClass}
                            placeholder={
                              paymentForm.method === "bank"
                                ? "e.g. Primary checking"
                                : "e.g. Visa debit"
                            }
                            value={paymentForm.accountLabel}
                            onChange={(e) =>
                              setPaymentForm((prev) => ({
                                ...prev,
                                accountLabel: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <p className="text-xs text-zinc-500">
                          Payment details are encrypted. You can update this
                          anytime in account settings.
                        </p>
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
