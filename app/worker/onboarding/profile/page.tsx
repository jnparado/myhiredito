"use client";

import { WorkerAccountShell } from "../../../components/worker/WorkerAccountShell";
import {
  authFieldClass,
  authLabelClass,
  OnboardingStepForm,
  OnboardingStepLayout,
} from "../../../components/worker/OnboardingStepLayout";
import { useWorkerAuth } from "../../../hooks/useWorkerAuth";
import { getWorkerProfile } from "../../../lib/workerAuth";

export default function ProfileOnboardingPage() {
  const { user } = useWorkerAuth();
  const profile = user ? getWorkerProfile(user) : null;

  return (
    <WorkerAccountShell>
      <OnboardingStepLayout
        stepId="profile"
        title="Complete your profile"
        description="Add your contact info and when you're available to work."
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
                defaultValue={profile?.first_name ?? ""}
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
                defaultValue={profile?.last_name ?? ""}
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
              defaultValue={profile?.phone ?? ""}
              required
            />
          </div>

          <div>
            <label htmlFor="location" className={authLabelClass}>
              City or area
            </label>
            <input
              id="location"
              name="location"
              className={authFieldClass}
              placeholder="Austin, TX"
              defaultValue={profile?.location ?? ""}
            />
          </div>

          <div>
            <label htmlFor="availability" className={authLabelClass}>
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              className={authFieldClass}
              defaultValue={profile?.availability ?? ""}
              required
            >
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
