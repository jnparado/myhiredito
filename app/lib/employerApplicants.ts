import type { EmployerJobPost } from "./employerJobs";
import { EMPLOYER_DEMO_EMAIL } from "./employerDemoAuth";
import type { EmployerAuthUser } from "./employerAuth";
import { getEmployerEmail } from "./employerAuth";

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
  workerUserKey?: string;
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
      workerUserKey: "worker@demo.com",
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

export function getApplicantLookupKeys(
  user: EmployerAuthUser | null,
  userKey: string | null,
): string[] {
  const keys = new Set<string>();
  if (userKey) keys.add(userKey);
  if (!user) return [...keys];
  const email = getEmployerEmail(user).trim().toLowerCase();
  if (email) keys.add(email);
  if (email === EMPLOYER_DEMO_EMAIL) keys.add(EMPLOYER_DEMO_EMAIL);
  return [...keys];
}

export function getApplicantsForKeys(keys: string[]): JobApplicant[] {
  const byId = new Map<string, JobApplicant>();
  for (const key of keys) {
    for (const applicant of getApplicants(key)) {
      byId.set(applicant.id, applicant);
    }
  }
  return [...byId.values()].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
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
  extraKeys: string[] = [],
): JobApplicant[] {
  const merged = getApplicantsForKeys([userKey, ...extraKeys]);
  if (merged.length > 0) return merged;
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

export function addApplicantFromApplication(
  userKey: string,
  applicant: Omit<JobApplicant, "id"> & { id?: string },
): JobApplicant {
  const existing = getApplicants(userKey);
  const applicantEmail = applicant.workerEmail.trim().toLowerCase();
  const applicantName = applicant.workerName.trim().toLowerCase();
  const duplicate = existing.find((item) => {
    if (item.jobSlug !== applicant.jobSlug) return false;
    if (item.workerEmail.trim().toLowerCase() === applicantEmail) return true;
    if (
      applicant.workerUserKey &&
      item.workerUserKey &&
      item.workerUserKey === applicant.workerUserKey
    ) {
      return true;
    }
    return item.workerName.trim().toLowerCase() === applicantName;
  });
  if (duplicate) {
    const merged: JobApplicant = {
      ...duplicate,
      workerUserKey: applicant.workerUserKey || duplicate.workerUserKey,
      workerEmail: applicant.workerEmail || duplicate.workerEmail,
      workerName: applicant.workerName || duplicate.workerName,
      skills: applicant.skills || duplicate.skills,
      location: applicant.location || duplicate.location,
      examScore: applicant.examScore ?? duplicate.examScore,
    };
    if (JSON.stringify(merged) !== JSON.stringify(duplicate)) {
      saveApplicants(
        userKey,
        existing.map((item) => (item.id === duplicate.id ? merged : item)),
      );
    }
    return merged;
  }

  const created: JobApplicant = {
    ...applicant,
    id: applicant.id ?? `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };

  saveApplicants(userKey, [created, ...existing]);
  return created;
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
