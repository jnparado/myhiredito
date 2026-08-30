"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Job } from "@/app/lib/jobs";
import type { JobMatchResult, WorkerContext } from "@/app/lib/ai/types";

const CACHE_PREFIX = "myhiredito_ai_matches_";
const MATCH_JOB_LIMIT = 8;

function cacheKey(userKey: string, slugs: string[]): string {
  return `${CACHE_PREFIX}${userKey}_${slugs.sort().join(",")}`;
}

function workerFingerprint(worker: WorkerContext | null): string {
  if (!worker) return "";
  return [
    worker.displayName,
    worker.location ?? "",
    worker.availability ?? "",
    worker.headline ?? "",
    worker.onboardingComplete ? "1" : "0",
    ...(worker.skills ?? []),
  ].join("|");
}

export function useAiJobMatches(
  worker: WorkerContext | null,
  userKey: string | null,
  jobs: Job[],
) {
  const [matches, setMatches] = useState<Record<string, JobMatchResult>>({});
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"ai" | "heuristic" | null>(null);
  const inFlight = useRef(false);

  const fingerprint = workerFingerprint(worker);
  const jobSlugs = jobs
    .slice(0, MATCH_JOB_LIMIT)
    .map((job) => job.slug)
    .join(",");

  const refresh = useCallback(async () => {
    if (!worker || !userKey || jobs.length === 0) {
      setMatches({});
      return;
    }
    if (inFlight.current) return;

    const slice = jobs.slice(0, MATCH_JOB_LIMIT);
    const slugs = slice.map((job) => job.slug);
    const cached = localStorage.getItem(cacheKey(userKey, slugs));
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as {
          matches: JobMatchResult[];
          source: "ai" | "heuristic";
        };
        setMatches(
          Object.fromEntries(parsed.matches.map((match) => [match.slug, match])),
        );
        setSource(parsed.source);
        return;
      } catch {
        // continue to fetch
      }
    }

    inFlight.current = true;
    setLoading(true);
    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker,
          jobs: slice.map((job) => ({
            slug: job.slug,
            title: job.title,
            company: job.company,
            location: job.location,
            pay: job.pay,
            skills: job.skills,
            description: job.description,
            experienceLevel: job.experienceLevel,
          })),
        }),
      });

      const data = (await response.json()) as {
        matches?: JobMatchResult[];
        source?: "ai" | "heuristic";
      };

      const nextMatches = Object.fromEntries(
        (data.matches ?? []).map((match) => [match.slug, match]),
      );
      setMatches(nextMatches);
      setSource(data.source ?? null);
      localStorage.setItem(
        cacheKey(userKey, slugs),
        JSON.stringify({ matches: data.matches ?? [], source: data.source }),
      );
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [fingerprint, jobSlugs, userKey, worker, jobs]);

  useEffect(() => {
    void refresh();
  }, [fingerprint, jobSlugs, userKey]);

  return { matches, loading, source, refresh };
}

export function buildWorkerContext({
  displayName,
  profile,
  onboardingComplete,
  completedSteps,
}: {
  displayName: string;
  profile: {
    skills?: string[] | null;
    location?: string | null;
    availability?: string | null;
    headline?: string | null;
  } | null;
  onboardingComplete: boolean;
  completedSteps: string[];
}): WorkerContext {
  return {
    displayName,
    skills: profile?.skills ?? [],
    location: profile?.location ?? undefined,
    availability: profile?.availability ?? undefined,
    headline: profile?.headline ?? undefined,
    onboardingComplete,
    completedSteps,
  };
}
