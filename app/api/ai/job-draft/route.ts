import { NextResponse } from "next/server";
import { templateJobDraft } from "@/app/lib/ai/fallback";
import { isAiConfigured } from "@/app/lib/ai/config";
import {
  buildJobDraftPrompt,
  EMPLOYER_JOB_DRAFT_SYSTEM,
} from "@/app/lib/ai/prompts";
import { completeChat } from "@/app/lib/ai/provider";
import type { JobDraftInput, JobDraftResult } from "@/app/lib/ai/types";

export async function POST(request: Request) {
  let input: JobDraftInput | null = null;

  try {
    input = (await request.json()) as JobDraftInput;

    if (!input.title?.trim() || !input.category?.trim() || !input.location?.trim()) {
      return NextResponse.json(
        { error: "Title, category, and location are required" },
        { status: 400 },
      );
    }

    if (!isAiConfigured()) {
      return NextResponse.json({
        draft: templateJobDraft(input),
        source: "template",
      });
    }

    const raw = await completeChat(
      [
        { role: "system", content: EMPLOYER_JOB_DRAFT_SYSTEM },
        { role: "user", content: buildJobDraftPrompt(input) },
      ],
      { json: true },
    );

    const parsed = JSON.parse(raw) as Partial<JobDraftResult>;
    const draft: JobDraftResult = {
      description: parsed.description ?? templateJobDraft(input).description,
      requirements: parsed.requirements ?? templateJobDraft(input).requirements,
      skills: parsed.skills ?? templateJobDraft(input).skills,
      schedule: parsed.schedule ?? templateJobDraft(input).schedule,
      source: "ai",
    };

    return NextResponse.json({ draft, source: "ai" });
  } catch {
    if (!input) {
      return NextResponse.json({ error: "AI draft failed" }, { status: 500 });
    }
    return NextResponse.json({
      draft: templateJobDraft(input),
      source: "template",
    });
  }
}
