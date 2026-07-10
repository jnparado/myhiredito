"use client";

import Link from "next/link";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerJobs } from "@/app/hooks/useEmployerJobs";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import {
  getEmployerCompanyName,
  getEmployerDisplayName,
} from "@/app/lib/employerAuth";

function StatRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <>
      <span className="text-xs font-semibold text-zinc-800">{value}</span>
      <span className="text-[11px] text-zinc-500">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-1 flex-col items-center border-r border-zinc-200 py-3 last:border-r-0 hover:bg-zinc-50"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center border-r border-zinc-200 py-3 last:border-r-0">
      {content}
    </div>
  );
}

export function EmployerProfileSidebar() {
  const { user, loading } = useEmployerAuth();
  const { activeCount } = useEmployerJobs();
  const { progress } = useEmployerOnboarding();

  if (loading || !user) return null;

  const name = getEmployerDisplayName(user);
  const company =
    progress.data.businessCertificate?.legalBusinessName ||
    getEmployerCompanyName(user);
  const industry = progress.data.businessDetails?.industry;
  const location = progress.data.businessDetails
    ? [progress.data.businessDetails.city, progress.data.businessDetails.state]
        .filter(Boolean)
        .join(", ")
    : null;
  const headline = [company, industry].filter(Boolean).join(" · ");

  return (
    <aside className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="h-14 bg-gradient-to-r from-[#0f1115] to-[#1a5c42]" />
        <div className="px-4 pb-4">
          <div className="-mt-7 mb-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#1db954] text-lg font-bold text-white">
            {name.charAt(0)}
          </div>
          <Link
            href="#"
            className="text-sm font-bold text-zinc-900 hover:text-[#1db954] hover:underline"
          >
            {name}
          </Link>
          <p className="mt-0.5 text-xs leading-5 text-zinc-600">{headline}</p>
          {location && (
            <p className="mt-1 text-[11px] text-zinc-500">{location}</p>
          )}

          <Link
            href="/employer/onboarding/business-details"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-dashed border-zinc-300 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-[#1db954] hover:text-[#1db954]"
          >
            + Add business details
          </Link>
        </div>

        <div className="flex border-t border-zinc-200">
          <StatRow label="Active jobs" value={activeCount} />
          <StatRow label="Applicants" value={0} />
          <StatRow label="Profile views" value={0} />
        </div>

        <div className="border-t border-zinc-200 px-4 py-3">
          <Link
            href="/employer/onboarding/business-details"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">🏢</span>
            Company profile
          </Link>
          <Link
            href="#"
            className="mt-2 flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">⭐</span>
            Saved candidates
          </Link>
          <Link
            href="#"
            className="mt-2 flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#1db954]"
          >
            <span className="text-zinc-400">📅</span>
            Hiring calendar
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-300/60 bg-white px-4 py-3 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
          Quick links
        </p>
        <Link
          href="#"
          className="mt-2 block text-xs font-semibold text-zinc-700 hover:text-[#1db954]"
        >
          Review applicants
        </Link>
        <Link
          href="#"
          className="mt-1.5 block text-xs font-semibold text-zinc-700 hover:text-[#1db954]"
        >
          Manage billing
        </Link>
        <Link
          href="#"
          className="mt-1.5 block text-xs font-semibold text-zinc-700 hover:text-[#1db954]"
        >
          Help center
        </Link>
      </div>
    </aside>
  );
}
