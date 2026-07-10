import { NextResponse } from "next/server";
import { fallbackChatReply } from "@/app/lib/ai/fallback";
import { isAiConfigured } from "@/app/lib/ai/config";
import { buildChatContext, WORKER_ASSISTANT_SYSTEM } from "@/app/lib/ai/prompts";
import { completeChat } from "@/app/lib/ai/provider";
import type { AiChatMessage, WorkerContext } from "@/app/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: AiChatMessage[];
      worker?: WorkerContext;
    };

    const messages = body.messages ?? [];
    const worker = body.worker;

    if (!worker || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing worker context or messages" },
        { status: 400 },
      );
    }

    if (!isAiConfigured()) {
      return NextResponse.json({
        reply: fallbackChatReply(worker, messages),
        source: "heuristic",
      });
    }

    const reply = await completeChat([
      { role: "system", content: WORKER_ASSISTANT_SYSTEM },
      {
        role: "system",
        content: `Current worker context:\n${buildChatContext(worker)}`,
      },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ]);

    return NextResponse.json({ reply, source: "ai" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
