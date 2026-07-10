"use client";

import { useCallback, useEffect, useState } from "react";
import type { AiChatMessage, WorkerContext } from "@/app/lib/ai/types";

const STORAGE_PREFIX = "myhiredito_ai_chat_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

export function useAiAssistant(worker: WorkerContext | null, userKey: string | null) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userKey || typeof window === "undefined") {
      setMessages([]);
      return;
    }
    const raw = localStorage.getItem(storageKey(userKey));
    if (!raw) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm your MyHiredito AI assistant. Ask me about job matches, onboarding, role exams, or how to get hired faster.",
        },
      ]);
      return;
    }
    try {
      setMessages(JSON.parse(raw) as AiChatMessage[]);
    } catch {
      setMessages([]);
    }
  }, [userKey]);

  const persist = useCallback(
    (next: AiChatMessage[]) => {
      if (!userKey) return;
      localStorage.setItem(storageKey(userKey), JSON.stringify(next));
    },
    [userKey],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!worker || !content.trim() || loading) return;

      const userMessage: AiChatMessage = { role: "user", content: content.trim() };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      persist(nextMessages);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages, worker }),
        });

        const data = (await response.json()) as {
          reply?: string;
          error?: string;
        };

        if (!response.ok || !data.reply) {
          throw new Error(data.error ?? "AI assistant unavailable");
        }

        const withReply = [
          ...nextMessages,
          { role: "assistant" as const, content: data.reply },
        ];
        setMessages(withReply);
        persist(withReply);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get AI reply");
      } finally {
        setLoading(false);
      }
    },
    [worker, messages, loading, persist],
  );

  const clearChat = useCallback(() => {
    const starter: AiChatMessage[] = [
      {
        role: "assistant",
        content:
          "Chat cleared. Ask me anything about jobs, shifts, or your worker profile.",
      },
    ];
    setMessages(starter);
    persist(starter);
  }, [persist]);

  return { messages, loading, error, sendMessage, clearChat };
}
