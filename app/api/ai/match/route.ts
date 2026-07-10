import { NextResponse } from "next/server";
import { heuristicJobMatches } from "@/app/lib/ai/fallback";
import { isAiConfigured } from "@/app/lib/ai/config";
import { buildMatchPrompt } from "@/app/lib/ai/prompts";
import { completeChat, parseJsonArray } from "@/app/lib/ai/provider";
import type { JobMatchInput, JobMatchResult, WorkerContext } from "@/app/lib/ai/types";

function scoreLabel(score: number): JobMatchResult["label"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Good";
  return "Fair";
}

export async function POST(request: Request) {
  let worker: WorkerContext | undefined;
  let jobs: JobMatchInput[] = [];

  try {
    const body = (await request.json()) as {
      worker?: WorkerContext;
      jobs?: JobMatchInput[];
    };

    worker = body.worker;
    jobs = body.jobs ?? [];

    if (!worker || jobs.length === 0) {
      return NextResponse.json(
        { error: "Missing worker context or jobs" },
        { status: 400 },
      );
    }

    if (!isAiConfigured()) {
      return NextResponse.json({
        matches: heuristicJobMatches(worker, jobs),
        source: "heuristic",
      });
    }

    const raw = await completeChat(
      [
        {
          role: "system",
          content:
            "You score job-worker fit for a staffing marketplace. Return ONLY a JSON array.",
        },
        { role: "user", content: buildMatchPrompt(worker, jobs) },
      ],
      { json: true },
    );

    const parsed = parseJsonArray<{
      slug: string;
      score: number;
      reasons?: string[];
    }>(raw);

    const matches: JobMatchResult[] = jobs.map((job) => {
      const found = parsed.find((item) => item.slug === job.slug);
      const score = Math.min(99, Math.max(20, Math.round(found?.score ?? 50)));
      return {
        slug: job.slug,
        score,
        label: scoreLabel(score),
        reasons:
          found?.reasons?.slice(0, 3) ??
          heuristicJobMatches(worker!, [job])[0].reasons,
        source: "ai",
      };
    });

    return NextResponse.json({ matches, source: "ai" });
  } catch {
    if (!worker || jobs.length === 0) {
      return NextResponse.json({ error: "AI match failed" }, { status: 500 });
    }
    return NextResponse.json({
      matches: heuristicJobMatches(worker, jobs),
      source: "heuristic",
    });
  }
}
