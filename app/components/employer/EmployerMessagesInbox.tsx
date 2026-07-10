"use client";

import Link from "next/link";
import { useEmployerMessages } from "@/app/hooks/useEmployerMessages";
import {
  formatMessageTime,
  getEmployerConversationPreview,
  getEmployerConversationUnreadCount,
} from "@/app/lib/employerMessages";

export function EmployerMessagesInbox() {
  const { conversations, unreadCount, loading } = useEmployerMessages();

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
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Inbox
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Chat with applicants, workers, and MyHiredito support.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zinc-900">No messages yet</h2>
          </div>
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-bold text-zinc-900">Your inbox is empty</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              When workers apply to your jobs, conversations will appear here.
            </p>
            <Link
              href="/employer/dashboard?post=1"
              className="mt-6 inline-flex rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a5c42]"
            >
              Post a job
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
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
              const unread = getEmployerConversationUnreadCount(conversation);
              const preview = getEmployerConversationPreview(conversation);

              return (
                <li
                  key={conversation.id}
                  className="border-b border-zinc-100 last:border-0"
                >
                  <Link
                    href={`/employer/messages/${conversation.id}`}
                    className={`block px-4 py-3 transition hover:bg-zinc-50 ${
                      unread > 0 ? "bg-red-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: conversation.avatarColor }}
                      >
                        {conversation.participantName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-zinc-900">
                            {conversation.participantName}
                          </p>
                          <span className="shrink-0 text-[11px] text-zinc-400">
                            {formatMessageTime(conversation.updatedAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {conversation.jobTitle ?? "MyHiredito"}
                          {conversation.skills ? ` · ${conversation.skills}` : ""}
                        </p>
                        <p
                          className={`mt-1 line-clamp-2 text-xs leading-5 ${
                            unread > 0
                              ? "font-semibold text-zinc-800"
                              : "text-zinc-500"
                          }`}
                        >
                          {unread > 0
                            ? `${unread} new message${unread === 1 ? "" : "s"} — ${preview}`
                            : preview}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-zinc-100 px-4 py-3">
            <Link
              href="/employer/dashboard"
              className="block text-sm font-semibold text-[#1db954] hover:underline"
            >
              Review applicants on your dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
