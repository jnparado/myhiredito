import type { AssessmentResult } from "./jobAssessments";

export type JobApplication = {
  jobSlug: string;
  jobTitle: string;
  company: string;
  category: string;
  location: string;
  pay: string;
  appliedAt: string;
  assessment?: AssessmentResult;
  status: "submitted" | "under-review";
};

const ASSESSMENT_PREFIX = "myhiredito_assessment_";
const APPLICATIONS_PREFIX = "myhiredito_applications_";

function assessmentKey(userKey: string, jobSlug: string): string {
  return `${ASSESSMENT_PREFIX}${userKey}_${jobSlug}`;
}

function applicationsKey(userKey: string): string {
  return `${APPLICATIONS_PREFIX}${userKey}`;
}

export function saveAssessmentResult(
  userKey: string,
  result: AssessmentResult,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(assessmentKey(userKey, result.jobSlug), JSON.stringify(result));
  window.dispatchEvent(new Event("myhiredito-job-applications"));
}

export function getAssessmentResult(
  userKey: string,
  jobSlug: string,
): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(assessmentKey(userKey, jobSlug));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AssessmentResult;
  } catch {
    return null;
  }
}

export function getJobApplications(userKey: string): JobApplication[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(applicationsKey(userKey));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JobApplication[];
  } catch {
    return [];
  }
}

export function submitJobApplication(
  userKey: string,
  application: JobApplication,
): void {
  if (typeof window === "undefined") return;
  const existing = getJobApplications(userKey);
  const withoutDuplicate = existing.filter(
    (item) => item.jobSlug !== application.jobSlug,
  );
  localStorage.setItem(
    applicationsKey(userKey),
    JSON.stringify([application, ...withoutDuplicate]),
  );
  window.dispatchEvent(new Event("myhiredito-job-applications"));
}

export function hasAppliedToJob(userKey: string, jobSlug: string): boolean {
  return getJobApplications(userKey).some((item) => item.jobSlug === jobSlug);
}
