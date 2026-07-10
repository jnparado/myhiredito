"use client";

import { useCallback, useEffect, useState } from "react";
import type { Job } from "@/app/lib/jobs";
import type { JobMatchResult, WorkerContext } from "@/app/lib/ai/types";

const CACHE_PREFIX = "myhiredito_ai_matches_";

function cacheKey(userKey: string, slugs: string[]): string {
  return `${CACHE_PREFIX}${userKey}_${slugs.sort().join(",")}`;
}

export function useAiJobMatches(
  worker: WorkerContext | null,
  userKey: string | null,
  jobs: Job[],
) {
  const [matches, setMatches] = useState<Record<string, JobMatchResult>>({});
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"ai" | "heuristic" | null>(null);

  const refresh = useCallback(async () => {
    if (!worker || !userKey || jobs.length === 0) {
      setMatches({});
      return;
    }

    const slugs = jobs.map((job) => job.slug);
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

    setLoading(true);
    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker,
          jobs: jobs.map((job) => ({
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
      setLoading(false);
    }
  }, [worker, userKey, jobs]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
