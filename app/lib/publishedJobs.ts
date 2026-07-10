import type { EmployerJobPost } from "./employerJobs";
import type { Job } from "./jobs";

const STORAGE_KEY = "myhiredito_published_jobs";

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-published-jobs"));
}

export function employerJobToMarketplaceJob(job: EmployerJobPost): Job {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.companyName,
    category: job.category.includes("Nurse") || job.category.includes("CNA") || job.category.includes("Health")
      ? "Healthcare"
      : "Admin Support",
    location: job.location,
    pay: job.pay,
    payType: job.payType,
    type: job.jobType,
    schedule: job.schedule,
    postedAt: job.postedAt.slice(0, 10),
    experienceLevel: job.experienceLevel,
    skills: job.skills.length > 0 ? job.skills : [job.category],
    proposals: job.applicants,
    verified: true,
    description: job.description,
    responsibilities: job.description
      .split(". ")
      .filter(Boolean)
      .slice(0, 4)
      .map((s) => s.trim()),
    requirements: job.requirements
      ? job.requirements.split("\n").filter(Boolean)
      : ["Complete role assessment to apply"],
  };
}

export function getPublishedJobs(): Job[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

export function publishEmployerJob(job: EmployerJobPost): Job {
  const marketplaceJob = employerJobToMarketplaceJob(job);
  const existing = getPublishedJobs().filter((j) => j.slug !== job.slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([marketplaceJob, ...existing]));
  dispatchChange();
  return marketplaceJob;
}

export function unpublishEmployerJob(slug: string): void {
  const next = getPublishedJobs().filter((j) => j.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  dispatchChange();
}

export function incrementJobViews(slug: string): void {
  const jobs = getPublishedJobs();
  const next = jobs.map((j) =>
    j.slug === slug ? { ...j, proposals: j.proposals } : j,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function syncApplicantCountToPublished(slug: string, count: number): void {
  const jobs = getPublishedJobs();
  const next = jobs.map((j) =>
    j.slug === slug ? { ...j, proposals: count } : j,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  dispatchChange();
}
