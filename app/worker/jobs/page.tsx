import Link from "next/link";
import { JobsBrowser } from "./JobsBrowser";
import { JobsPageShell } from "../../components/worker/JobsPageShell";
import { jobs } from "../../lib/jobs";

export const metadata = {
  title: "Browse Jobs | MyHiredito",
  description: "Find on-demand and ongoing work opportunities near you.",
};

export default function JobsPage() {
  return (
    <JobsPageShell>
      <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-normal text-zinc-800 sm:text-2xl lg:text-3xl">
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
    </JobsPageShell>
  );
}
