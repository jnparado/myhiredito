"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useMessages } from "@/app/hooks/useMessages";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import {
  formatMessageTime,
  getConversation,
  getConversationPreview,
  getConversationUnreadCount,
  markConversationRead,
  sendMessage,
} from "@/app/lib/messages";

export function FloatingMessagingWidget() {
  const pathname = usePathname();
  const { user } = useWorkerAuth();
  const { userKey, conversations, unreadCount } = useMessages();
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState("");
  const [tick, setTick] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const displayName = user ? getWorkerDisplayName(user) : "Worker";
  const hideOnPage = pathname?.startsWith("/worker/messages");

  const activeConversation =
    userKey && activeConversationId
      ? getConversation(userKey, activeConversationId)
      : null;

  useEffect(() => {
    if (!userKey || !activeConversationId) return;
    markConversationRead(userKey, activeConversationId);
  }, [activeConversationId, userKey, tick]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tick, activeConversationId, isOpen]);

  useEffect(() => {
    function openMessaging() {
      setIsOpen(true);
      setActiveConversationId(null);
    }

    window.addEventListener("myhiredito-open-messaging", openMessaging);
    return () =>
      window.removeEventListener("myhiredito-open-messaging", openMessaging);
  }, []);

  if (!user || !userKey || hideOnPage) return null;

  function toggleOpen() {
    setIsOpen((open) => {
      if (open) {
        setActiveConversationId(null);
      }
      return !open;
    });
  }

  function openConversation(id: string) {
    setActiveConversationId(id);
    setIsOpen(true);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!userKey || !activeConversationId || !draft.trim()) return;

    sendMessage(userKey, activeConversationId, draft, displayName);
    setDraft("");
    setTick((value) => value + 1);
  }

  return (
    <div className="fixed bottom-0 right-4 z-[60] w-[288px] sm:right-6">
      {isOpen && (
        <div className="mb-0 overflow-hidden rounded-t-xl border border-b-0 border-zinc-200 bg-white shadow-2xl">
          {activeConversation ? (
            <>
              <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setActiveConversationId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100"
                  aria-label="Back to conversations"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: activeConversation.avatarColor }}
                >
                  {activeConversation.participantName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-zinc-900">
                    {activeConversation.participantName}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {activeConversation.company}
                  </p>
                </div>
              </div>

              <div className="h-72 space-y-3 overflow-y-auto bg-zinc-50 px-3 py-3">
                {activeConversation.messages.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-zinc-500">
                    Start the conversation.
                  </p>
                ) : (
                  activeConversation.messages.map((message) => {
                    const isWorker = message.sender === "worker";
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isWorker ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-3 py-2 ${
                            isWorker
                              ? "rounded-br-sm bg-[var(--brand)] text-white"
                              : "rounded-bl-sm border border-zinc-200 bg-white text-zinc-800"
                          }`}
                        >
                          <p className="text-xs leading-5">{message.body}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="border-t border-zinc-100 bg-white px-3 py-2.5"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message..."
                    className="h-9 flex-1 rounded-full border border-zinc-200 px-3 text-xs outline-none focus:border-[var(--brand)]"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-white disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="border-b border-zinc-100 px-4 py-3">
                <p className="text-sm font-bold text-zinc-900">Messaging</p>
                {unreadCount > 0 && (
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {unreadCount} unread conversation{unreadCount === 1 ? "" : "s"}
                  </p>
                )}
              </div>

              <ul className="max-h-80 overflow-y-auto">
                {conversations.map((conversation) => {
                  const unread = getConversationUnreadCount(conversation);
                  return (
                    <li key={conversation.id} className="border-b border-zinc-100 last:border-0">
                      <button
                        type="button"
                        onClick={() => openConversation(conversation.id)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-zinc-50 ${
                          unread > 0 ? "bg-red-50/30" : ""
                        }`}
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: conversation.avatarColor }}
                        >
                          {conversation.participantName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold text-zinc-900">
                              {conversation.participantName}
                            </p>
                            <span className="shrink-0 text-[10px] text-zinc-400">
                              {formatMessageTime(conversation.updatedAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                            {getConversationPreview(conversation)}
                          </p>
                        </div>
                        {unread > 0 && (
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-zinc-100 px-4 py-2.5">
                <Link
                  href="/worker/messages"
                  className="text-xs font-semibold text-[var(--brand)] hover:underline"
                >
                  See all in inbox
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      <div className="rounded-t-xl border border-zinc-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <button
            type="button"
            onClick={toggleOpen}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[var(--brand)] text-sm font-bold text-white">
                {displayName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <span className="truncate text-sm font-bold text-zinc-900">Messaging</span>
            {unreadCount > 0 && !isOpen && (
              <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100"
            aria-label="More messaging options"
            onClick={() => {
              setIsOpen(true);
              setActiveConversationId(null);
            }}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="19" cy="12" r="1.75" />
            </svg>
          </button>

          <Link
            href="/worker/jobs"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100"
            aria-label="Compose new message"
            title="Browse jobs to message employers"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={toggleOpen}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100"
            aria-label={isOpen ? "Minimize messaging" : "Expand messaging"}
          >
            <svg
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
