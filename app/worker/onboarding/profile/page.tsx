"use client";

import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  OnboardingStepForm,
  OnboardingStepLayout,
} from "../../../components/worker/OnboardingStepLayout";

export default function ProfileOnboardingPage() {
  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="profile"
        title="Complete your profile"
        description="Tell employers about your experience, skills, and when you're available to work."
      >
        <OnboardingStepForm stepId="profile">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className={authLabelClass}>
                First name
              </label>
              <input
                id="first-name"
                name="firstName"
                className={authFieldClass}
                placeholder="Alex"
                required
              />
            </div>
            <div>
              <label htmlFor="last-name" className={authLabelClass}>
                Last name
              </label>
              <input
                id="last-name"
                name="lastName"
                className={authFieldClass}
                placeholder="Rivera"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className={authLabelClass}>
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={authFieldClass}
              placeholder="(555) 123-4567"
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
              required
            />
          </div>

          <div>
            <label htmlFor="availability" className={authLabelClass}>
              Availability
            </label>
            <select id="availability" name="availability" className={authFieldClass} required>
              <option value="">Select availability</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="weekends">Weekends only</option>
              <option value="flexible">Flexible / per diem</option>
            </select>
          </div>
        </OnboardingStepForm>
      </OnboardingStepLayout>
    </WorkerAccountShell>
  );
}
