"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JobDetailView } from "@/app/components/JobDetailView";
import { getJobDetailMeta } from "@/app/lib/jobDetails";
import type { Job } from "@/app/lib/jobs";
import { getPublishedJobs } from "@/app/lib/publishedJobs";

export function DynamicJobDetail({ slug }: { slug: string }) {
  const [job, setJob] = useState<Job | null | undefined>(undefined);

  useEffect(() => {
    const published = getPublishedJobs().find((j) => j.slug === slug);
    setJob(published ?? null);
  }, [slug]);

  if (job === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading job...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-800">Job not found</p>
        <Link
          href="/worker/jobs"
          className="mt-4 inline-flex text-sm font-semibold text-[var(--brand)] hover:underline"
        >
          Browse all jobs
        </Link>
      </div>
    );
  }

  return <JobDetailView job={job} meta={getJobDetailMeta(job)} />;
}
