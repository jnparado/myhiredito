"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  authButtonClass,
  authFieldClass,
  authLabelClass,
} from "@/app/components/auth/AuthShell";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import {
  getEmployerCompanyName,
  getEmployerDisplayName,
} from "@/app/lib/employerAuth";
import { getEmployerUserKey, saveOnboardingStep } from "@/app/lib/employerOnboarding";
import { incrementProfileViews } from "@/app/lib/employerStats";

export function EmployerProfileView() {
  const { user } = useEmployerAuth();
  const { progress, isComplete } = useEmployerOnboarding();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const details = progress.data.businessDetails;
  const cert = progress.data.businessCertificate;
  const company =
    cert?.legalBusinessName || (user ? getEmployerCompanyName(user) : "");
  const displayName = user ? getEmployerDisplayName(user) : "";

  useEffect(() => {
    const key = getEmployerUserKey(user);
    if (key) incrementProfileViews(key);
  }, [user]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const userKey = getEmployerUserKey(user);
    if (!userKey) return;

    setSaving(true);
    setSaved(false);
    try {
      const formData = new FormData(e.currentTarget);
      await saveOnboardingStep(user, userKey, "business-details", formData);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Company profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {displayName} · {company}
        </p>
      </div>

      {!isComplete && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Complete{" "}
          <Link href="/employer/dashboard" className="font-bold underline">
            onboarding
          </Link>{" "}
          to unlock all profile fields.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <label className={authLabelClass}>Primary business address</label>
          <input
            name="address"
            className={authFieldClass}
            defaultValue={details?.address ?? ""}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={authLabelClass}>City</label>
            <input
              name="city"
              className={authFieldClass}
              defaultValue={details?.city ?? ""}
              required
            />
          </div>
          <div>
            <label className={authLabelClass}>State</label>
            <input
              name="state"
              className={authFieldClass}
              defaultValue={details?.state ?? ""}
              required
            />
          </div>
          <div>
            <label className={authLabelClass}>ZIP</label>
            <input
              name="zip"
              className={authFieldClass}
              defaultValue={details?.zip ?? ""}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={authLabelClass}>Industry</label>
            <input
              name="industry"
              className={authFieldClass}
              defaultValue={details?.industry ?? ""}
              required
            />
          </div>
          <div>
            <label className={authLabelClass}>Business phone</label>
            <input
              name="contactPhone"
              type="tel"
              className={authFieldClass}
              defaultValue={details?.contactPhone ?? ""}
              required
            />
          </div>
        </div>
        <div>
          <label className={authLabelClass}>Website</label>
          <input
            name="website"
            type="url"
            className={authFieldClass}
            defaultValue={details?.website ?? ""}
          />
        </div>
        <input type="hidden" name="locationsCount" value={details?.locationsCount ?? "1"} />
        <input type="hidden" name="notes" value={details?.notes ?? ""} />
        {(details?.hiringRoles ?? []).map((role) => (
          <input key={role} type="hidden" name="hiringRoles" value={role} />
        ))}

        {saved && (
          <p className="text-sm font-semibold text-emerald-600">Profile saved.</p>
        )}

        <button type="submit" disabled={saving} className={authButtonClass}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900">Verification documents</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Government ID: {progress.completedSteps.includes("identity") ? "✓ Submitted" : "Pending"}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Business certificate:{" "}
          {progress.completedSteps.includes("business-certificate")
            ? "✓ Submitted"
            : "Pending"}
        </p>
        <Link
          href="/employer/onboarding/id"
          className="mt-3 inline-flex text-sm font-semibold text-[#1db954] hover:underline"
        >
          Update verification documents →
        </Link>
      </div>
    </div>
  );
}
