import { jobs, type Job } from "./jobs";
import { getPublishedJobs } from "./publishedJobs";

/** All jobs visible in the marketplace: static catalog + employer-published. */
export function getAllMarketplaceJobs(): Job[] {
  const published = typeof window !== "undefined" ? getPublishedJobs() : [];
  const publishedSlugs = new Set(published.map((job) => job.slug));
  const staticOnly = jobs.filter((job) => !publishedSlugs.has(job.slug));
  return [...published, ...staticOnly];
}

/** Resolve a job by slug from static catalog or published employer jobs. */
export function resolveJobBySlug(slug: string): Job | null {
  const staticJob = jobs.find((job) => job.slug === slug);
  if (staticJob) return staticJob;

  if (typeof window === "undefined") return null;
  return getPublishedJobs().find((job) => job.slug === slug) ?? null;
}
