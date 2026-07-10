import Link from "next/link";
import {
  experienceLabels,
  formatPostedAgo,
  type Job,
} from "../lib/jobs";
import type { JobMatchResult } from "../lib/ai/types";

const typeLabels: Record<Job["type"], string> = {
  "on-demand": "On-demand",
  ongoing: "Ongoing",
  "temp-to-perm": "Temp-to-perm",
};

export function JobCard({
  job,
  compact,
  match,
}: {
  job: Job;
  compact?: boolean;
  match?: JobMatchResult;
}) {
  return (
    <Link
      href={`/worker/jobs/${job.slug}`}
      className="group block rounded-xl border border-black/5 bg-white p-4 transition hover:border-[var(--brand)]/40 hover:shadow-md sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-[var(--brand-dark)] group-hover:text-[var(--brand)] sm:text-lg">
            {job.title}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {job.company} · {formatPostedAgo(job.postedAt)}
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold text-[var(--brand-dark)]">
          {job.pay}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {match && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1db954]/10 px-2 py-0.5 font-bold text-[#1a5c42]">
            ✦ {match.score}% match · {match.label}
          </span>
        )}
        {job.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 font-semibold text-[var(--brand)]">
            ✓ Payment verified
          </span>
        )}
        <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 font-medium text-[var(--muted)]">
          {experienceLabels[job.experienceLevel]}
        </span>
        <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 font-medium text-[var(--muted)]">
          {typeLabels[job.type]}
        </span>
        {!compact && (
          <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 font-medium text-[var(--muted)]">
            {job.location}
          </span>
        )}
      </div>

      {match && !compact && (
        <p className="mt-2 text-xs text-zinc-500">{match.reasons[0]}</p>
      )}

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
        {job.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, compact ? 3 : 5).map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-black/5 bg-[var(--surface)] px-2 py-0.5 text-xs font-medium text-[var(--muted)]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-3 text-xs text-[var(--muted)]">
        <span>
          <span className="font-semibold text-[var(--brand-dark)]">
            {job.proposals}
          </span>{" "}
          proposals
        </span>
        <span className="font-semibold text-[var(--brand)] group-hover:underline">
          View job →
        </span>
      </div>
    </Link>
  );
}
