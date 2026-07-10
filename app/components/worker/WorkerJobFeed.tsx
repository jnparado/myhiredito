"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJobApplications } from "@/app/hooks/useJobApplications";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerFeed } from "@/app/hooks/useWorkerFeed";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { formatPostedAgo } from "@/app/lib/workerFeed";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import { isOnboardingComplete } from "@/app/lib/workerOnboarding";
import type { Job } from "@/app/lib/jobs";
import type { WorkerFeedItem } from "@/app/lib/workerFeed";

type SortOption = "recent" | "matches" | "pay";

function FeedAction({
  icon,
  label,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50";
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}

function EmbeddedJobCard({
  job,
  canApply,
}: {
  job: Job;
  canApply: boolean;
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
      <div className="flex items-start gap-3 p-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#0f1115] text-sm font-bold text-white">
          {job.company.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-zinc-900">{job.title}</p>
          <p className="text-xs text-zinc-600">
            {job.company} · {job.location}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#1a5c42]">
            <span className="text-[#1db954]">✓</span>
            Actively reviewing applicants
          </p>
        </div>
        <Link
          href={`/worker/jobs/${job.slug}`}
          className="shrink-0 rounded-full border border-[#1db954] px-3 py-1 text-[10px] font-bold uppercase text-[#1a5c42] transition hover:bg-[#1db954]/10"
        >
          {canApply ? "Quick apply" : "View job"}
        </Link>
      </div>
    </div>
  );
}

function WorkerPostCard({
  displayName,
  body,
  type,
  postedAt,
}: {
  displayName: string;
  body: string;
  type: string;
  postedAt: string;
}) {
  const labels: Record<string, string> = {
    availability: "📅 Availability update",
    credential: "📜 Credential update",
    win: "🏆 Shift win",
  };

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
      <div className="px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
          {labels[type] ?? "Update"}
        </p>
        <div className="mt-2 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1db954] text-sm font-bold text-white">
            {displayName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-zinc-900">{displayName}</p>
            <p className="text-[11px] text-zinc-500">
              {formatPostedAgo(postedAt)} · 🌐 Workers on MyHiredito
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-800">{body}</p>
      </div>
      <div className="flex border-t border-zinc-200">
        <FeedAction
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.278 2.081-.756 1.07-.98 1.484-2.403 1.12-3.994a2.072 2.072 0 00-1.12-3.994C8.268 1.28 6.633 1.28 5.4 2.506a2.072 2.072 0 00-1.12 3.994c.364 1.591-.05 3.014-1.12 3.994a2.072 2.072 0 001.12 3.994c.806.478 1.533.756 2.081.756" />
            </svg>
          }
          label="Celebrate"
        />
        <FeedAction
          href="/worker/messages"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          }
          label="Message"
        />
      </div>
    </article>
  );
}

function sortFeed(items: WorkerFeedItem[], sort: SortOption): WorkerFeedItem[] {
  const list = [...items];
  if (sort === "pay") {
    return list.sort((a, b) => {
      const payA = "job" in a && a.kind === "job" ? a.job.pay : "";
      const payB = "job" in b && b.kind === "job" ? b.job.pay : "";
      return payB.localeCompare(payA);
    });
  }
  if (sort === "matches") {
    return list.sort((a, b) => {
      const score = (item: WorkerFeedItem) =>
        item.kind === "job" || item.kind === "network" ? 1 : 0;
      return score(b) - score(a);
    });
  }
  return list.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
}

export function WorkerJobFeed() {
  const { user } = useWorkerAuth();
  const { feed, loading } = useWorkerFeed();
  const { progress } = useWorkerOnboarding();
  const { applications } = useJobApplications();
  const [sort, setSort] = useState<SortOption>("recent");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const displayName = user ? getWorkerDisplayName(user) : "You";
  const canApply = isOnboardingComplete(progress);
  const appliedSlugs = new Set(applications.map((a) => a.jobSlug));

  const sortedFeed = useMemo(() => sortFeed(feed, sort), [feed, sort]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-300/60 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
        Loading your feed...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Sort by:
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700"
        >
          <option value="recent">Recent</option>
          <option value="matches">Best matches</option>
          <option value="pay">Highest pay</option>
        </select>
      </div>

      {sortedFeed.map((item) => {
        if (item.kind === "worker") {
          return (
            <WorkerPostCard
              key={item.id}
              displayName={displayName}
              body={item.activity.body}
              type={item.activity.type}
              postedAt={item.postedAt}
            />
          );
        }

        if (item.kind === "shift" || item.kind === "update") {
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm"
            >
              <div className="px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                  {item.kind === "shift" ? "📅 Open shift nearby" : "📢 Hiring update"}
                </p>
                <h3 className="mt-1 text-base font-bold text-zinc-900">
                  {item.activity.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-700">{item.activity.body}</p>
                {item.kind === "shift" && (
                  <p className="mt-2 text-xs text-zinc-500">
                    {item.activity.shiftDate} · {item.activity.location} ·{" "}
                    {item.activity.pay}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-zinc-400">
                  {formatPostedAgo(item.postedAt)} · {item.companyName}
                </p>
              </div>
              <div className="flex border-t border-zinc-200">
                <FeedAction
                  href="/worker/jobs"
                  icon={<span className="text-[#1db954]">⚡</span>}
                  label="I'm interested"
                />
                <FeedAction
                  href="/worker/messages"
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  }
                  label="Ask details"
                />
              </div>
            </article>
          );
        }

        const isNetwork = item.kind === "network";
        const post = isNetwork ? item.post : null;
        const job = isNetwork ? post?.job : item.kind === "job" ? item.job : undefined;
        const author = isNetwork ? post!.author : item.kind === "job" ? item.author : "";
        const headline = isNetwork ? post!.headline : item.kind === "job" ? item.headline : "";
        const body = isNetwork ? post!.body : item.kind === "job" ? item.job.description : "";
        const hashtags = isNetwork ? post!.hashtags : [];
        const postedAt = item.postedAt;
        const likes = isNetwork ? post!.likes : item.kind === "job" ? item.likes : 0;
        const likedBy = isNetwork ? post!.likedBy : item.kind === "job" ? item.likedBy : undefined;
        const connection = isNetwork ? post!.connection : "Hiring";
        const itemId = item.id;

        return (
          <article
            key={itemId}
            className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm"
          >
            {likedBy && (
              <div className="border-b border-zinc-100 px-4 py-2 text-[11px] text-zinc-500">
                <span className="font-semibold text-zinc-700">{likedBy}</span> and{" "}
                {likes - 1} others matched with this
              </div>
            )}

            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0f1115] text-sm font-bold text-white">
                  {author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-900">
                    {author}
                    <span className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500">
                      {connection}
                    </span>
                  </p>
                  <p className="text-[11px] text-zinc-600">{headline}</p>
                  <p className="text-[11px] text-zinc-400">
                    {formatPostedAgo(postedAt)} · 🌐 Anyone on MyHiredito
                  </p>
                </div>
                {connection === "Hiring" && (
                  <Link
                    href="/worker/connect"
                    className="shrink-0 rounded-full border border-zinc-400 px-3 py-1 text-[10px] font-bold uppercase text-zinc-600 transition hover:border-[#1db954] hover:text-[#1db954]"
                  >
                    + Follow
                  </Link>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-800">{body}</p>

              {hashtags.length > 0 && (
                <p className="mt-2 text-sm font-semibold text-[#1a5c42]">
                  {hashtags.join(" ")}
                </p>
              )}

              {job && (
                <EmbeddedJobCard
                  job={job}
                  canApply={canApply && !appliedSlugs.has(job.slug)}
                />
              )}

              <p className="mt-3 text-[11px] font-semibold text-zinc-400">
                {likes} worker{likes !== 1 ? "s" : ""} interested
              </p>
            </div>

            <div className="flex border-t border-zinc-200">
              <FeedAction
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.278 2.081-.756 1.07-.98 1.484-2.403 1.12-3.994a2.072 2.072 0 00-1.12-3.994C8.268 1.28 6.633 1.28 5.4 2.506a2.072 2.072 0 00-1.12 3.994c.364 1.591-.05 3.014-1.12 3.994a2.072 2.072 0 001.12 3.994c.806.478 1.533.756 2.081.756" />
                  </svg>
                }
                label="Interested"
              />
              <FeedAction
                href="/worker/messages"
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                }
                label="Message"
              />
              <FeedAction
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                }
                label={saved.has(itemId) ? "Saved" : "Save job"}
                onClick={() => toggleSave(itemId)}
              />
              {job && (
                <FeedAction
                  href={`/worker/jobs/${job.slug}`}
                  icon={<span className="text-[#1db954]">→</span>}
                  label="Apply"
                />
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
