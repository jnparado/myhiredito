"use client";

import { useMemo, useState } from "react";
import { JobCard } from "../../components/JobCard";
import {
  experienceLabels,
  jobCategories,
  jobs,
  type ExperienceLevel,
  type Job,
} from "../../lib/jobs";

export function JobsBrowser() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [experience, setExperience] = useState<ExperienceLevel | "all">("all");
  const [payType, setPayType] = useState<Job["payType"] | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
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
  }, [search, category, experience, payType]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      {/* Sidebar filters — sticky while scrolling job list */}
      <aside className="sticky top-4 z-10 w-full shrink-0 lg:top-6 lg:w-56">
        <div className="max-h-[calc(100vh-2rem)] space-y-6 overflow-y-auto rounded-xl border border-black/5 bg-white p-5 lg:max-h-[calc(100vh-3rem)]">
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
                      ({jobs.filter((j) => j.category === cat).length})
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

        <p className="mt-4 text-sm text-[var(--muted)]">
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
            filtered.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}
