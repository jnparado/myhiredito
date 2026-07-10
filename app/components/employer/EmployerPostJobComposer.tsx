"use client";

import { useEffect, useState } from "react";
import {
  authButtonClass,
  authErrorClass,
  authFieldClass,
  authLabelClass,
} from "@/app/components/auth/AuthShell";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import { getEmployerCompanyName, getEmployerDisplayName } from "@/app/lib/employerAuth";
import {
  createEmployerJobFromForm,
  getEmployerUserKeyFromAuth,
} from "@/app/lib/employerJobs";
import { EMPLOYER_HIRING_ROLE_OPTIONS } from "@/app/lib/employerOnboarding";
import { experienceLabels } from "@/app/lib/jobs";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function EmployerPostJobModal({ open, onClose }: Props) {
  const { user } = useEmployerAuth();
  const { progress } = useEmployerOnboarding();
  const [loading, setLoading] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const defaultLocation = progress.data.businessDetails
    ? [progress.data.businessDetails.city, progress.data.businessDetails.state]
        .filter(Boolean)
        .join(", ")
    : "";

  async function handleAiDraft() {
    const form = document.getElementById("employer-post-job-form") as HTMLFormElement | null;
    if (!form || !user) return;

    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value.trim();
    const location = (form.elements.namedItem("location") as HTMLInputElement).value.trim();
    const pay = (form.elements.namedItem("pay") as HTMLInputElement).value.trim();

    if (!title || !category || !location || !pay) {
      setError("Fill in title, role, location, and pay before using AI draft.");
      return;
    }

    setError(null);
    setDrafting(true);

    try {
      const companyName =
        progress.data.businessCertificate?.legalBusinessName ||
        getEmployerCompanyName(user);

      const response = await fetch("/api/ai/job-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          location,
          pay,
          companyName,
        }),
      });

      const data = (await response.json()) as {
        draft?: {
          description: string;
          requirements: string;
          skills: string;
          schedule: string;
        };
        error?: string;
      };

      if (!response.ok || !data.draft) {
        throw new Error(data.error ?? "AI draft failed");
      }

      (form.elements.namedItem("description") as HTMLTextAreaElement).value =
        data.draft.description;
      (form.elements.namedItem("requirements") as HTMLTextAreaElement).value =
        data.draft.requirements;
      (form.elements.namedItem("skills") as HTMLInputElement).value =
        data.draft.skills;
      (form.elements.namedItem("schedule") as HTMLInputElement).value =
        data.draft.schedule;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "AI draft failed.");
    } finally {
      setDrafting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const userKey = getEmployerUserKeyFromAuth(user);
    if (!userKey) return;

    setError(null);
    setLoading(true);

    try {
      const companyName =
        progress.data.businessCertificate?.legalBusinessName ||
        getEmployerCompanyName(user);
      createEmployerJobFromForm(userKey, companyName, new FormData(e.currentTarget));
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12 sm:pt-20">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-xl rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-lg font-bold text-zinc-900">Post a job opening</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          id="employer-post-job-form"
          className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4"
          onSubmit={handleSubmit}
        >
          <div className="rounded-lg border border-[#1db954]/20 bg-[#1db954]/5 px-4 py-3">
            <p className="text-sm font-semibold text-zinc-800">✦ Draft with AI</p>
            <p className="mt-1 text-xs text-zinc-600">
              Fill title, role, location, and pay — then let AI write the description and requirements.
            </p>
            <button
              type="button"
              onClick={() => void handleAiDraft()}
              disabled={drafting}
              className="mt-3 rounded-full border border-[#1db954] px-4 py-1.5 text-xs font-bold text-[#1a5c42] hover:bg-[#1db954]/10 disabled:opacity-50"
            >
              {drafting ? "Drafting..." : "Generate job copy"}
            </button>
          </div>

          <div>
            <label htmlFor="job-title" className={authLabelClass}>
              Job title
            </label>
            <input
              id="job-title"
              name="title"
              className={authFieldClass}
              placeholder="e.g. Certified Nursing Assistant (CNA)"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="job-category" className={authLabelClass}>
                Role / category
              </label>
              <select id="job-category" name="category" className={authFieldClass} required>
                <option value="">Select role</option>
                {EMPLOYER_HIRING_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="job-location" className={authLabelClass}>
                Location
              </label>
              <input
                id="job-location"
                name="location"
                className={authFieldClass}
                placeholder="City, State"
                defaultValue={defaultLocation}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="job-pay" className={authLabelClass}>
                Pay rate
              </label>
              <input
                id="job-pay"
                name="pay"
                className={authFieldClass}
                placeholder="e.g. $22–$26/hr"
                required
              />
            </div>
            <div>
              <label htmlFor="job-pay-type" className={authLabelClass}>
                Pay type
              </label>
              <select id="job-pay-type" name="payType" className={authFieldClass} defaultValue="hourly">
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed / per shift</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="job-type" className={authLabelClass}>
                Job type
              </label>
              <select id="job-type" name="jobType" className={authFieldClass} defaultValue="ongoing">
                <option value="on-demand">On-demand / per shift</option>
                <option value="ongoing">Ongoing</option>
                <option value="temp-to-perm">Temp-to-perm</option>
              </select>
            </div>
            <div>
              <label htmlFor="job-experience" className={authLabelClass}>
                Experience level
              </label>
              <select
                id="job-experience"
                name="experienceLevel"
                className={authFieldClass}
                defaultValue="intermediate"
              >
                {Object.entries(experienceLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="job-schedule" className={authLabelClass}>
              Schedule
            </label>
            <input
              id="job-schedule"
              name="schedule"
              className={authFieldClass}
              placeholder="e.g. Day & evening shifts · 3–5 days/week"
              required
            />
          </div>

          <div>
            <label htmlFor="job-description" className={authLabelClass}>
              Job description
            </label>
            <textarea
              id="job-description"
              name="description"
              rows={4}
              className={authFieldClass}
              placeholder="Describe the role, team, and what success looks like..."
              required
            />
          </div>

          <div>
            <label htmlFor="job-requirements" className={authLabelClass}>
              Requirements
            </label>
            <textarea
              id="job-requirements"
              name="requirements"
              rows={3}
              className={authFieldClass}
              placeholder="Certifications, experience, licenses required..."
            />
          </div>

          <div>
            <label htmlFor="job-skills" className={authLabelClass}>
              Skills (comma-separated)
            </label>
            <input
              id="job-skills"
              name="skills"
              className={authFieldClass}
              placeholder="CNA, Patient Care, CPR"
            />
          </div>

          {error && <div className={authErrorClass}>{error}</div>}

          <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className={authButtonClass}>
              {loading ? "Posting..." : "Post job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type ComposerProps = {
  onOpenModal: () => void;
  onOpenShift: () => void;
  onOpenUpdate: () => void;
};

export function EmployerPostJobComposer({
  onOpenModal,
  onOpenShift,
  onOpenUpdate,
}: ComposerProps) {
  const { user } = useEmployerAuth();
  const { isComplete, loading: onboardingLoading } = useEmployerOnboarding();

  const name = user ? getEmployerDisplayName(user) : "Employer";
  const canPost = !onboardingLoading && isComplete;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1db954] text-sm font-bold text-white">
          {name.charAt(0)}
        </div>
        <button
          type="button"
          onClick={canPost ? onOpenModal : undefined}
          disabled={!canPost}
          className={`flex-1 rounded-full border px-4 py-3 text-left text-sm font-semibold transition ${
            canPost
              ? "border-zinc-300 text-zinc-500 hover:border-[#1db954] hover:bg-zinc-50"
              : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
          }`}
        >
          {canPost ? "Post a job opening..." : "Complete onboarding to post jobs..."}
        </button>
      </div>

      <div className="flex border-t border-zinc-200">
        <button
          type="button"
          onClick={canPost ? onOpenModal : undefined}
          disabled={!canPost}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-[#1db954]">+</span>
          Post job
        </button>
        <button
          type="button"
          onClick={canPost ? onOpenShift : undefined}
          disabled={!canPost}
          className="flex flex-1 items-center justify-center gap-2 border-l border-zinc-200 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-blue-500">📅</span>
          Add shift
        </button>
        <button
          type="button"
          onClick={canPost ? onOpenUpdate : undefined}
          disabled={!canPost}
          className="flex flex-1 items-center justify-center gap-2 border-l border-zinc-200 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-amber-500">📢</span>
          Hiring update
        </button>
      </div>
    </div>
  );
}
