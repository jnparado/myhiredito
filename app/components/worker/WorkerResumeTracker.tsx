"use client";

import Link from "next/link";
import { useJobApplications } from "@/app/hooks/useJobApplications";
import { useResumeTracker } from "@/app/hooks/useResumeTracker";
import { formatPostedAgo } from "@/app/lib/jobs";

export function WorkerResumeTracker() {
  const { tracker } = useResumeTracker();
  const { applications } = useJobApplications();
  const posted = Boolean(tracker.lastPostedAt);
  const underReview = applications.filter(
    (item) => item.status === "under-review" || item.status === "interview",
  ).length;
  const hired = applications.filter((item) => item.status === "hired").length;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-800">Resume tracker</h2>
          <p className="text-[11px] text-zinc-500">
            {posted
              ? `Live · posted ${formatPostedAgo(tracker.lastPostedAt!)}`
              : "Post your resume to start tracking"}
          </p>
        </div>
        <Link
          href="/worker/applications"
          className="text-xs font-bold text-[#1db954] hover:underline"
        >
          Pipeline →
        </Link>
      </div>

      {posted ? (
        <div className="grid grid-cols-3 divide-x divide-zinc-100">
          <div className="px-4 py-3">
            <p className="text-lg font-bold tabular-nums text-zinc-900">
              {applications.length}
            </p>
            <p className="text-[11px] text-zinc-500">Applications</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-lg font-bold tabular-nums text-zinc-900">
              {underReview}
            </p>
            <p className="text-[11px] text-zinc-500">In review</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-lg font-bold tabular-nums text-zinc-900">{hired}</p>
            <p className="text-[11px] text-zinc-500">Hired</p>
          </div>
        </div>
      ) : (
        <p className="px-4 py-4 text-xs text-zinc-500">
          Share your resume from the composer below. Employers will see it on
          your post and you can track applications here.
        </p>
      )}

      {posted && tracker.lastPostPreview && (
        <p className="border-t border-zinc-100 px-4 py-2.5 text-[11px] text-zinc-500">
          Latest post: {tracker.lastPostPreview}
        </p>
      )}
    </div>
  );
}
