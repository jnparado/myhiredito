"use client";

import { EmployerAccountShell } from "@/app/components/employer/EmployerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  EmployerOnboardingStepForm,
  EmployerOnboardingStepLayout,
} from "@/app/components/employer/EmployerOnboardingStepLayout";
import {
  EMPLOYER_HIRING_ROLE_OPTIONS,
  EMPLOYER_INDUSTRY_OPTIONS,
} from "@/app/lib/employerOnboarding";

export default function EmployerBusinessDetailsPage() {
  return (
    <EmployerAccountShell>
      <EmployerOnboardingStepLayout
        stepId="business-details"
        title="Business details & hiring needs"
        description="Tell us where you operate, what industry you're in, and which roles you plan to hire for on MyHiredito."
      >
        <EmployerOnboardingStepForm stepId="business-details">
          <div>
            <label htmlFor="address" className={authLabelClass}>
              Primary business address
            </label>
            <input
              id="address"
              name="address"
              className={authFieldClass}
              placeholder="Street address"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className={authLabelClass}>
                City
              </label>
              <input id="city" name="city" className={authFieldClass} required />
            </div>
            <div>
              <label htmlFor="state" className={authLabelClass}>
                State
              </label>
              <input id="state" name="state" className={authFieldClass} required />
            </div>
            <div>
              <label htmlFor="zip" className={authLabelClass}>
                ZIP code
              </label>
              <input id="zip" name="zip" className={authFieldClass} required />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="industry" className={authLabelClass}>
                Industry
              </label>
              <select id="industry" name="industry" className={authFieldClass} required>
                <option value="">Select industry</option>
                {EMPLOYER_INDUSTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="locations-count" className={authLabelClass}>
                Number of locations
              </label>
              <select
                id="locations-count"
                name="locationsCount"
                className={authFieldClass}
                defaultValue="1"
                required
              >
                <option value="1">1 location</option>
                <option value="2-5">2–5 locations</option>
                <option value="6-20">6–20 locations</option>
                <option value="20+">20+ locations</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-phone" className={authLabelClass}>
                Business phone
              </label>
              <input
                id="contact-phone"
                name="contactPhone"
                type="tel"
                className={authFieldClass}
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label htmlFor="website" className={authLabelClass}>
                Company website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className={authFieldClass}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          <div>
            <p className={authLabelClass}>Roles you plan to hire</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {EMPLOYER_HIRING_ROLE_OPTIONS.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
                >
                  <input
                    type="checkbox"
                    name="hiringRoles"
                    value={role}
                    className="h-4 w-4 rounded border-zinc-300 text-[#1db954] focus:ring-[#1db954]"
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={authLabelClass}>
              Additional details (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className={authFieldClass}
              placeholder="Shift volume, compliance needs, preferred start date, etc."
            />
          </div>
        </EmployerOnboardingStepForm>
      </EmployerOnboardingStepLayout>
    </EmployerAccountShell>
  );
}
