"use client";

import Link from "next/link";
import { useMessages } from "@/app/hooks/useMessages";
import {
  formatMessageTime,
  getConversationPreview,
  getConversationUnreadCount,
} from "@/app/lib/messages";

export function MessagesInbox() {
  const { conversations, unreadCount, loading } = useMessages();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
          Inbox
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Chat with employers, recruiters, and MyHiredito support.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zinc-900">No messages yet</h2>
          </div>
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-bold text-zinc-900">Your inbox is empty</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              When employers want to reach you, conversations will appear here.
            </p>
            <Link
              href="/worker/jobs"
              className="mt-6 inline-flex rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zinc-900">All conversations</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-red-600">
                {unreadCount} unread
              </span>
            )}
          </div>

          <ul>
            {conversations.map((conversation) => {
              const unread = getConversationUnreadCount(conversation);
              const preview = getConversationPreview(conversation);

              return (
                <li key={conversation.id} className="border-b border-zinc-100 last:border-0">
                  <Link
                    href={`/worker/messages/${conversation.id}`}
                    className={`block px-4 py-3 transition hover:bg-zinc-50 ${
                      unread > 0 ? "bg-red-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-zinc-900">
                          {unread > 0
                            ? `${unread} new message${unread === 1 ? "" : "s"} from ${conversation.participantName}`
                            : conversation.participantName}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                          {conversation.company}
                          {conversation.jobTitle
                            ? ` · ${conversation.jobTitle}`
                            : ""}
                        </p>
                        <p
                          className={`mt-1 line-clamp-2 text-xs leading-5 ${
                            unread > 0
                              ? "font-semibold text-zinc-800"
                              : "text-zinc-500"
                          }`}
                        >
                          {preview}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-zinc-400">
                        {formatMessageTime(conversation.updatedAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-zinc-100 px-4 py-3">
            <Link
              href="/worker/jobs"
              className="block text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              Browse jobs to get more messages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
