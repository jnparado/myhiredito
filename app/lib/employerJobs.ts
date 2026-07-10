import type { ExperienceLevel, JobType, PayType } from "./jobs";
import { publishEmployerJob, syncApplicantCountToPublished, unpublishEmployerJob } from "./publishedJobs";
import { getEmployerUserKey } from "./employerOnboarding";
import type { EmployerAuthUser } from "./employerAuth";

export type EmployerJobStatus = "active" | "draft" | "closed";

export type EmployerJobPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  pay: string;
  payType: PayType;
  jobType: JobType;
  schedule: string;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string;
  skills: string[];
  applicants: number;
  views: number;
  status: EmployerJobStatus;
  postedAt: string;
  companyName: string;
};

const STORAGE_PREFIX = "myhiredito_employer_jobs_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchJobsChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-jobs"));
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "job";
}

export function getEmployerJobsLocal(userKey: string): EmployerJobPost[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];

  try {
    return JSON.parse(raw) as EmployerJobPost[];
  } catch {
    return [];
  }
}

export function saveEmployerJobsLocal(
  userKey: string,
  jobs: EmployerJobPost[],
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(jobs));
  dispatchJobsChange();
}

export function createEmployerJobFromForm(
  userKey: string,
  companyName: string,
  formData: FormData,
): EmployerJobPost {
  const title = String(formData.get("title") ?? "").trim();
  const skillsRaw = String(formData.get("skills") ?? "");
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const job: EmployerJobPost = {
    id: crypto.randomUUID(),
    slug: `${slugify(title)}-${Date.now().toString(36)}`,
    title,
    category: String(formData.get("category") ?? ""),
    location: String(formData.get("location") ?? "").trim(),
    pay: String(formData.get("pay") ?? "").trim(),
    payType: (formData.get("payType") as PayType) || "hourly",
    jobType: (formData.get("jobType") as JobType) || "ongoing",
    schedule: String(formData.get("schedule") ?? "").trim(),
    experienceLevel:
      (formData.get("experienceLevel") as ExperienceLevel) || "intermediate",
    description: String(formData.get("description") ?? "").trim(),
    requirements: String(formData.get("requirements") ?? "").trim(),
    skills,
    applicants: 0,
    views: 0,
    status: "active",
    postedAt: new Date().toISOString(),
    companyName,
  };

  const existing = getEmployerJobsLocal(userKey);
  saveEmployerJobsLocal(userKey, [job, ...existing]);
  publishEmployerJob(job);
  return job;
}

export function closeEmployerJob(userKey: string, jobId: string): void {
  const jobs = getEmployerJobsLocal(userKey);
  const job = jobs.find((j) => j.id === jobId);
  const next = jobs.map((j) =>
    j.id === jobId ? { ...j, status: "closed" as const } : j,
  );
  saveEmployerJobsLocal(userKey, next);
  if (job) unpublishEmployerJob(job.slug);
}

export function updateJobApplicantCount(
  userKey: string,
  jobId: string,
  count: number,
): void {
  const jobs = getEmployerJobsLocal(userKey).map((job) =>
    job.id === jobId ? { ...job, applicants: count } : job,
  );
  saveEmployerJobsLocal(userKey, jobs);
  const job = jobs.find((j) => j.id === jobId);
  if (job) syncApplicantCountToPublished(job.slug, count);
}

export function incrementJobViewCount(userKey: string, jobId: string): void {
  const jobs = getEmployerJobsLocal(userKey).map((job) =>
    job.id === jobId ? { ...job, views: job.views + 1 } : job,
  );
  saveEmployerJobsLocal(userKey, jobs);
}

export function getEmployerUserKeyFromAuth(
  user: EmployerAuthUser | null,
): string | null {
  return getEmployerUserKey(user);
}

export function formatPostedAgo(isoDate: string): string {
  const posted = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  return posted.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
