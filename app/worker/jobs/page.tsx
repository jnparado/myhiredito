import Link from "next/link";
import { JobsBrowser } from "./JobsBrowser";
import { WorkerShell } from "../../components/worker/WorkerShell";
import { jobs } from "../../lib/jobs";

export const metadata = {
  title: "Browse Jobs | MyHiredito",
  description: "Find on-demand and ongoing work opportunities near you.",
};

export default function JobsPage() {
  return (
    <WorkerShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-normal text-zinc-800 sm:text-3xl">
              Find work
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Browse {jobs.length}+ open jobs across healthcare, tech, design, and more.
            </p>
          </div>
          <Link
            href="/worker/signup"
            className="inline-flex h-10 items-center justify-center rounded bg-[var(--brand)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
          >
            Create profile
          </Link>
        </div>

        <JobsBrowser />
      </div>
    </WorkerShell>
  );
}
