"use client";

import { useEffect, useMemo, useState } from "react";
import { JobCard } from "../../components/JobCard";
import {
  buildWorkerContext,
  useAiJobMatches,
} from "../../hooks/useAiJobMatches";
import { useWorkerAuth } from "../../hooks/useWorkerAuth";
import { useWorkerOnboarding } from "../../hooks/useWorkerOnboarding";
import { getWorkerDisplayName } from "../../lib/workerAuth";
import {
  getWorkerUserKey,
  isOnboardingComplete,
} from "../../lib/workerOnboarding";
import {
  experienceLabels,
  jobCategories,
  jobs,
  type ExperienceLevel,
  type Job,
} from "../../lib/jobs";
import { getPublishedJobs } from "../../lib/publishedJobs";

export function JobsBrowser() {
  const { user } = useWorkerAuth();
  const { progress } = useWorkerOnboarding();
  const userKey = getWorkerUserKey(user);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [experience, setExperience] = useState<ExperienceLevel | "all">("all");
  const [payType, setPayType] = useState<Job["payType"] | "all">("all");
  const [sort, setSort] = useState<"recent" | "match">("match");
  const [showFilters, setShowFilters] = useState(false);
  const [allJobs, setAllJobs] = useState<Job[]>(jobs);

  const workerContext = user
    ? buildWorkerContext({
        displayName: getWorkerDisplayName(user),
        profile: user.profile,
        onboardingComplete: isOnboardingComplete(progress),
        completedSteps: progress.completedSteps,
      })
    : null;

  const { matches, loading: matchesLoading, source: matchSource } =
    useAiJobMatches(workerContext, userKey, allJobs);

  useEffect(() => {
    function refresh() {
      const published = getPublishedJobs();
      const slugs = new Set(published.map((j) => j.slug));
      setAllJobs([...published, ...jobs.filter((j) => !slugs.has(j.slug))]);
    }
    refresh();
    window.addEventListener("myhiredito-published-jobs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("myhiredito-published-jobs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = allJobs.filter((job) => {
      if (category !== "All" && job.category !== category) return false;
      if (experience !== "all" && job.experienceLevel !== experience)
        return false;
      if (payType !== "all" && job.payType !== payType) return false;
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q)) ||
        job.category.toLowerCase().includes(q)
      );
    });

    if (sort === "match" && userKey) {
      return [...list].sort((a, b) => {
        const scoreA = matches[a.slug]?.score ?? 0;
        const scoreB = matches[b.slug]?.score ?? 0;
        return scoreB - scoreA;
      });
    }

    return [...list].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
  }, [search, category, experience, payType, allJobs, sort, userKey, matches]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
      {/* Mobile category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {jobCategories.slice(0, 6).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              category === cat
                ? "bg-[var(--brand)] text-white"
                : "border border-zinc-200 bg-white text-zinc-600"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowFilters((open) => !open)}
          className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700"
        >
          {showFilters ? "Hide filters" : "More filters"}
        </button>
      </div>

      {/* Sidebar filters */}
      <aside
        className={`w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-56 ${
          showFilters ? "block" : "hidden lg:block"
        }`}
      >
        <div className="max-h-none space-y-6 overflow-y-auto rounded-xl border border-black/5 bg-white p-4 sm:p-5 lg:max-h-[calc(100vh-3rem)]">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Category
            </label>
            <div className="mt-2 space-y-1">
              {jobCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                    category === cat
                      ? "bg-[var(--brand-light)] text-[var(--brand-dark)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className="ml-1 text-xs opacity-60">
                      ({allJobs.filter((j) => j.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Experience
            </label>
            <div className="mt-2 space-y-1">
              {(["all", "entry", "intermediate", "expert"] as const).map(
                (level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperience(level)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                      experience === level
                        ? "bg-[var(--brand-light)] text-[var(--brand-dark)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {level === "all" ? "All levels" : experienceLabels[level]}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Pay type
            </label>
            <div className="mt-2 space-y-1">
              {(["all", "hourly", "fixed"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPayType(type)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                    payType === type
                      ? "bg-[var(--brand-light)] text-[var(--brand-dark)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {type === "all"
                    ? "All types"
                    : type === "hourly"
                      ? "Hourly"
                      : "Fixed price"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Job list */}
      <div className="min-w-0 flex-1">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search jobs by title, skill, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-black/10 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            <span className="font-semibold text-[var(--brand-dark)]">
              {filtered.length}
            </span>{" "}
            jobs found
            {category !== "All" && (
              <span>
                {" "}
                in <span className="font-semibold">{category}</span>
              </span>
            )}
          </p>
          {userKey && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "recent" | "match")}
                className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-zinc-700"
              >
                <option value="match">AI best match</option>
                <option value="recent">Most recent</option>
              </select>
              {matchesLoading && (
                <span className="text-[11px] text-zinc-400">Scoring...</span>
              )}
              {!matchesLoading && matchSource && (
                <span className="text-[11px] font-semibold text-[#1a5c42]">
                  ✦ {matchSource === "ai" ? "AI" : "Smart"} match
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-black/5 bg-white p-10 text-center">
              <p className="text-base font-semibold text-[var(--brand-dark)]">
                No jobs match your search
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            filtered.map((job) => (
              <JobCard key={job.id} job={job} match={matches[job.slug]} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
