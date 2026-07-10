import type { EmployerJobPost } from "./employerJobs";

export type ApplicantStatus =
  | "new"
  | "reviewing"
  | "interview"
  | "hired"
  | "rejected";

export type JobApplicant = {
  id: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  workerName: string;
  workerEmail: string;
  skills: string;
  experience: string;
  examScore?: number;
  status: ApplicantStatus;
  appliedAt: string;
  location: string;
};

const STORAGE_PREFIX = "myhiredito_employer_applicants_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-applicants"));
}

function defaultApplicants(jobs: EmployerJobPost[]): JobApplicant[] {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const firstJob = jobs[0];

  return [
    {
      id: "app-alex-rivera",
      jobId: firstJob?.id ?? "demo-job-1",
      jobSlug: firstJob?.slug ?? "certified-nursing-assistant",
      jobTitle: firstJob?.title ?? "Certified Nursing Assistant (CNA)",
      workerName: "Alex Rivera",
      workerEmail: "alex.rivera@email.com",
      skills: "CNA · Patient Care · CPR",
      experience: "3 years",
      examScore: 92,
      status: "new",
      appliedAt: new Date(now - hour * 5).toISOString(),
      location: "Austin, TX",
    },
    {
      id: "app-maria-santos",
      jobId: firstJob?.id ?? "demo-job-1",
      jobSlug: firstJob?.slug ?? "registered-nurse-icu",
      jobTitle: "Registered Nurse (RN)",
      workerName: "Maria Santos",
      workerEmail: "maria.santos@email.com",
      skills: "RN · ICU · ACLS",
      experience: "5 years",
      examScore: 88,
      status: "reviewing",
      appliedAt: new Date(now - hour * 28).toISOString(),
      location: "Austin, TX",
    },
    {
      id: "app-james-chen",
      jobId: firstJob?.id ?? "demo-job-2",
      jobSlug: firstJob?.slug ?? "home-health-aide",
      jobTitle: firstJob?.title ?? "Home Health Aide",
      workerName: "James Chen",
      workerEmail: "james.chen@email.com",
      skills: "Home Health · Elder Care",
      experience: "2 years",
      examScore: 76,
      status: "interview",
      appliedAt: new Date(now - hour * 52).toISOString(),
      location: "Round Rock, TX",
    },
  ];
}

export function getApplicants(userKey: string): JobApplicant[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JobApplicant[];
  } catch {
    return [];
  }
}

export function saveApplicants(
  userKey: string,
  applicants: JobApplicant[],
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(applicants));
  dispatchChange();
}

export function ensureApplicants(
  userKey: string,
  jobs: EmployerJobPost[],
): JobApplicant[] {
  const existing = getApplicants(userKey);
  if (existing.length > 0) return existing;
  const seeded = defaultApplicants(jobs);
  saveApplicants(userKey, seeded);
  return seeded;
}

export function getApplicantsByJob(
  userKey: string,
  jobId: string,
): JobApplicant[] {
  return getApplicants(userKey).filter((a) => a.jobId === jobId);
}

export function getApplicantCount(userKey: string): number {
  return getApplicants(userKey).filter((a) => a.status !== "rejected").length;
}

export function getNewApplicantCount(userKey: string): number {
  return getApplicants(userKey).filter((a) => a.status === "new").length;
}

export function updateApplicantStatus(
  userKey: string,
  applicantId: string,
  status: ApplicantStatus,
): void {
  const next = getApplicants(userKey).map((a) =>
    a.id === applicantId ? { ...a, status } : a,
  );
  saveApplicants(userKey, next);
}

export const APPLICANT_STATUS_LABELS: Record<ApplicantStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};

export const APPLICANT_STATUS_COLORS: Record<ApplicantStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  interview: "bg-purple-100 text-purple-700",
  hired: "bg-emerald-100 text-emerald-700",
  rejected: "bg-zinc-100 text-zinc-500",
};
