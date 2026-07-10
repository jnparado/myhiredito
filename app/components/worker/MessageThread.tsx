"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import {
  formatMessageTime,
  getConversation,
  markConversationRead,
  sendMessage,
  ensureDemoConversations,
} from "@/app/lib/messages";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";

type Props = {
  conversationId: string;
};

export function MessageThread({ conversationId }: Props) {
  const { user } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [draft, setDraft] = useState("");
  const [tick, setTick] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userKey) return;
    ensureDemoConversations(userKey);
    markConversationRead(userKey, conversationId);
  }, [conversationId, userKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tick, conversationId]);

  if (!userKey) {
    return (
      <div className="px-4 py-16 text-center text-sm text-zinc-500">
        Sign in to view messages.
      </div>
    );
  }

  const conversation = getConversation(userKey, conversationId);

  if (!conversation) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-800">Conversation not found</p>
        <Link
          href="/worker/messages"
          className="mt-4 inline-flex text-sm font-semibold text-[var(--brand)] hover:underline"
        >
          Back to inbox
        </Link>
      </div>
    );
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!userKey || !draft.trim()) return;

    const workerName = user ? getWorkerDisplayName(user) : "You";
    sendMessage(userKey, conversationId, draft, workerName);
    setDraft("");
    setTick((value) => value + 1);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/worker/messages"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100"
            aria-label="Back to inbox"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: conversation.avatarColor }}
          >
            {conversation.participantName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-900">
              {conversation.participantName}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {conversation.company}
              {conversation.jobTitle ? ` · ${conversation.jobTitle}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-50 px-4 py-5">
        {conversation.messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
            Start the conversation — introduce yourself and ask about the role.
          </div>
        ) : (
          conversation.messages.map((message) => {
            const isWorker = message.sender === "worker";
            return (
              <div
                key={message.id}
                className={`flex ${isWorker ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isWorker
                      ? "rounded-br-md bg-[var(--brand)] text-white"
                      : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  {!isWorker && (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm leading-6">{message.body}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isWorker ? "text-white/70" : "text-zinc-400"
                    }`}
                  >
                    {formatMessageTime(message.sentAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-zinc-200 bg-white p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message..."
            className="h-11 flex-1 rounded-xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--brand)] px-5 text-sm font-bold text-white transition hover:bg-[var(--brand-strong)] disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
