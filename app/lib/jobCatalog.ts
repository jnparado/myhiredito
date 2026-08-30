import { jobs, type Job } from "./jobs";
import { getPublishedJobs } from "./publishedJobs";
import { listingToMarketplaceJob, EXTERNAL_HIRING_BOARD } from "./externalHiringBoard";

/** All jobs visible in the marketplace: static catalog + employer-published + board imports. */
export function getAllMarketplaceJobs(): Job[] {
  const published = typeof window !== "undefined" ? getPublishedJobs() : [];
  const publishedSlugs = new Set(published.map((job) => job.slug));
  const external = EXTERNAL_HIRING_BOARD.map(listingToMarketplaceJob).filter(
    (job) => !publishedSlugs.has(job.slug),
  );
  const staticOnly = jobs.filter((job) => !publishedSlugs.has(job.slug));
  return [...published, ...external, ...staticOnly];
}

/** Resolve a job by slug from static catalog, external boards, or published employer jobs. */
export function resolveJobBySlug(slug: string): Job | null {
  const staticJob = jobs.find((job) => job.slug === slug);
  if (staticJob) return staticJob;

  const external = EXTERNAL_HIRING_BOARD.map(listingToMarketplaceJob).find(
    (job) => job.slug === slug,
  );
  if (external) return external;

  if (typeof window === "undefined") return null;
  return getPublishedJobs().find((job) => job.slug === slug) ?? null;
}
