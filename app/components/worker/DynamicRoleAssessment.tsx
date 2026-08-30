"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleAssessment } from "./RoleAssessment";
import { resolveJobBySlug } from "@/app/lib/jobCatalog";
import type { Job } from "@/app/lib/jobs";

export function DynamicRoleAssessment({ slug }: { slug: string }) {
  const [job, setJob] = useState<Job | null | undefined>(undefined);

  useEffect(() => {
    setJob(resolveJobBySlug(slug));
  }, [slug]);

  if (job === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        Loading assessment...
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

  return <RoleAssessment job={job} />;
}
