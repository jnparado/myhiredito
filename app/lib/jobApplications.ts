import type { AssessmentResult } from "./jobAssessments";
import type { Job } from "./jobs";
import { syncApplicationToEmployerPipeline } from "./applicationBridge";

export type JobApplicationStatus =
  | "submitted"
  | "under-review"
  | "interview"
  | "hired"
  | "rejected";

export type JobApplication = {
  jobSlug: string;
  jobTitle: string;
  company: string;
  category: string;
  location: string;
  pay: string;
  appliedAt: string;
  assessment?: AssessmentResult;
  status: JobApplicationStatus;
};

const ASSESSMENT_PREFIX = "myhiredito_assessment_";
const APPLICATIONS_PREFIX = "myhiredito_applications_";

function assessmentKey(userKey: string, jobSlug: string): string {
  return `${ASSESSMENT_PREFIX}${userKey}_${jobSlug}`;
}

function applicationsKey(userKey: string): string {
  return `${APPLICATIONS_PREFIX}${userKey}`;
}

export function listStoredApplicationUserKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(APPLICATIONS_PREFIX)) {
      keys.push(key.slice(APPLICATIONS_PREFIX.length));
    }
  }
  return keys;
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
  options?: {
    job?: Job;
    workerName?: string;
    workerEmail?: string;
    workerSkills?: string;
    workerLocation?: string;
  },
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

  if (options?.job && options.workerName && options.workerEmail) {
    syncApplicationToEmployerPipeline({
      workerUserKey: userKey,
      workerName: options.workerName,
      workerEmail: options.workerEmail,
      workerSkills: options.workerSkills,
      workerLocation: options.workerLocation,
      application,
      job: options.job,
    });
  }
}

export function hasAppliedToJob(userKey: string, jobSlug: string): boolean {
  return getJobApplications(userKey).some((item) => item.jobSlug === jobSlug);
}

export function updateWorkerApplicationStatus(
  userKey: string,
  jobSlug: string,
  status: JobApplicationStatus,
): void {
  if (typeof window === "undefined") return;
  const existing = getJobApplications(userKey);
  const next = existing.map((item) =>
    item.jobSlug === jobSlug ? { ...item, status } : item,
  );
  localStorage.setItem(applicationsKey(userKey), JSON.stringify(next));
  window.dispatchEvent(new Event("myhiredito-job-applications"));
}

export const APPLICATION_STATUS_LABELS: Record<JobApplicationStatus, string> = {
  submitted: "Submitted",
  "under-review": "Under review",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};
