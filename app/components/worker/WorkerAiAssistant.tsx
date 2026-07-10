"use client";

import { useEffect, useRef, useState } from "react";
import { useAiAssistant } from "@/app/hooks/useAiAssistant";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { buildWorkerContext } from "@/app/hooks/useAiJobMatches";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import {
  getOnboardingCompletionCount,
  getWorkerUserKey,
  isOnboardingComplete,
} from "@/app/lib/workerOnboarding";

const QUICK_PROMPTS = [
  "What jobs fit my skills?",
  "How do role exams work?",
  "What should I finish in onboarding?",
];

export function WorkerAiAssistant() {
  const { user } = useWorkerAuth();
  const { progress } = useWorkerOnboarding();
  const userKey = getWorkerUserKey(user);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const workerContext = user
    ? buildWorkerContext({
        displayName: getWorkerDisplayName(user),
        profile: user.profile,
        onboardingComplete: isOnboardingComplete(progress),
        completedSteps: progress.completedSteps,
      })
    : null;

  const { messages, loading, error, sendMessage, clearChat } = useAiAssistant(
    workerContext,
    userKey,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, loading]);

  if (!user || !userKey) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    await sendMessage(text);
  }

  return (
    <div className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] left-0 z-[54] sm:bottom-4 sm:left-4 sm:w-[300px] lg:bottom-4">
      {isOpen && (
        <div className="mb-0 overflow-hidden rounded-t-xl border border-b-0 border-zinc-200 bg-white shadow-2xl sm:rounded-xl sm:border-b">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-r from-[#0f1115] to-[#1a3d2e] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">MyHiredito AI</p>
              <p className="text-[11px] text-white/70">Career & shift assistant</p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              className="rounded px-2 py-1 text-[10px] font-bold uppercase text-white/80 hover:bg-white/10"
            >
              Clear
            </button>
          </div>

          <div className="h-[min(18rem,50vh)] space-y-3 overflow-y-auto bg-zinc-50 px-3 py-3 sm:h-72">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#1db954] text-white"
                      : "rounded-bl-sm border border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-xs text-zinc-500">Thinking...</p>
            )}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-zinc-100 px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-600 hover:border-[#1db954] hover:text-[#1a5c42]"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about jobs, exams, pay..."
                className="h-9 flex-1 rounded-full border border-zinc-200 px-3 text-xs outline-none focus:border-[#1db954]"
              />
              <button
                type="submit"
                disabled={loading || !draft.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1db954] text-white disabled:opacity-40"
                aria-label="Send to AI"
              >
                ✦
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-3 rounded-t-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] sm:rounded-xl"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1db954] to-[#0f1115] text-sm font-bold text-white">
          AI
        </div>
        <span className="text-sm font-bold text-zinc-900">Career assistant</span>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#1db954]">
          {isOpen ? "Close" : "Open"}
        </span>
      </button>
    </div>
  );
}
