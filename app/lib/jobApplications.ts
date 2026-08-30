import type { AssessmentResult } from "./jobAssessments";
import type { Job } from "./jobs";
import { jobs } from "./jobs";
import { syncApplicationToEmployerPipeline } from "./applicationBridge";
import { isWorkerDemoAccount, WORKER_DEMO_EMAIL } from "./workerDemoAuth";
import type { WorkerAuthUser } from "./workerAuth";
import { getWorkerDisplayName, getWorkerEmail } from "./workerAuth";

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

const APPLICATION_STATUSES: JobApplicationStatus[] = [
  "submitted",
  "under-review",
  "interview",
  "hired",
  "rejected",
];

function isJobApplication(value: unknown): value is JobApplication {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<JobApplication>;
  return typeof item.jobSlug === "string" && item.jobSlug.length > 0;
}

function normalizeApplication(item: JobApplication): JobApplication {
  const status = APPLICATION_STATUSES.includes(item.status)
    ? item.status
    : "submitted";
  return {
    jobSlug: item.jobSlug,
    jobTitle: item.jobTitle || "Untitled role",
    company: item.company || "Employer",
    category: item.category || "",
    location: item.location || "",
    pay: item.pay || "",
    appliedAt: item.appliedAt || new Date().toISOString(),
    assessment: item.assessment,
    status,
  };
}

export function getJobApplications(userKey: string): JobApplication[] {
  if (typeof window === "undefined" || !userKey) return [];
  const raw = localStorage.getItem(applicationsKey(userKey));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isJobApplication).map(normalizeApplication);
  } catch {
    return [];
  }
}

export function getApplicationLookupKeys(
  user: WorkerAuthUser | null,
  userKey: string | null,
): string[] {
  const keys = new Set<string>();
  if (userKey) keys.add(userKey);
  if (!user) return [...keys];

  const email = getWorkerEmail(user).trim().toLowerCase();
  if (email) keys.add(email);
  if (isWorkerDemoAccount(email, getWorkerDisplayName(user))) {
    keys.add(WORKER_DEMO_EMAIL);
  }
  return [...keys];
}

export function getJobApplicationsForKeys(keys: string[]): JobApplication[] {
  const bySlug = new Map<string, JobApplication>();
  for (const key of keys) {
    for (const application of getJobApplications(key)) {
      const existing = bySlug.get(application.jobSlug);
      if (
        !existing ||
        Date.parse(application.appliedAt) > Date.parse(existing.appliedAt)
      ) {
        bySlug.set(application.jobSlug, application);
      }
    }
  }
  return [...bySlug.values()].sort((a, b) =>
    b.appliedAt.localeCompare(a.appliedAt),
  );
}

function demoSeedApplications(): JobApplication[] {
  const now = Date.now();
  const cna = jobs.find((job) => job.slug === "certified-nursing-assistant") ?? jobs[0];
  const home = jobs.find((job) => job.slug === "home-health-aide") ?? jobs[2];
  return [
    {
      jobSlug: cna.slug,
      jobTitle: cna.title,
      company: cna.company,
      category: cna.category,
      location: cna.location,
      pay: cna.pay,
      appliedAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
      status: "under-review",
    },
    {
      jobSlug: home.slug,
      jobTitle: home.title,
      company: home.company,
      category: home.category,
      location: home.location,
      pay: home.pay,
      appliedAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
      status: "submitted",
    },
  ];
}

export function ensureDemoWorkerApplications(userKey: string): JobApplication[] {
  const existing = getJobApplications(userKey);
  if (existing.length > 0) return existing;
  const seeded = demoSeedApplications();
  if (typeof window === "undefined") return seeded;
  writeApplications(userKey, seeded);
  return seeded;
}

function writeApplications(userKey: string, applications: JobApplication[]): void {
  if (typeof window === "undefined" || !userKey) return;
  localStorage.setItem(applicationsKey(userKey), JSON.stringify(applications));
}

function upsertApplication(userKey: string, application: JobApplication): void {
  const existing = getJobApplications(userKey);
  const next = [
    normalizeApplication(application),
    ...existing.filter((item) => item.jobSlug !== application.jobSlug),
  ];
  writeApplications(userKey, next);
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
  const extraEmail = options?.workerEmail?.trim().toLowerCase();
  const keys = [userKey, extraEmail].filter(
    (key, index, list): key is string => !!key && list.indexOf(key) === index,
  );
  for (const key of keys) {
    upsertApplication(key, application);
  }
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

export function hasAppliedToJobForKeys(keys: string[], jobSlug: string): boolean {
  return getJobApplicationsForKeys(keys).some((item) => item.jobSlug === jobSlug);
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
