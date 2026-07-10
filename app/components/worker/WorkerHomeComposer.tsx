"use client";

import { useState } from "react";
import {
  authButtonClass,
  authFieldClass,
} from "@/app/components/auth/AuthShell";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { createWorkerPost, type WorkerActivityType } from "@/app/lib/workerActivity";
import { getWorkerDisplayName } from "@/app/lib/workerAuth";
import { getWorkerUserKey, isOnboardingComplete } from "@/app/lib/workerOnboarding";

type ModalKind = WorkerActivityType | null;

const PLACEHOLDERS: Record<WorkerActivityType, string> = {
  availability:
    "Open for evening CNA shifts this weekend in Austin. Per-diem preferred.",
  credential:
    "Just renewed my BLS certification — available for acute care roles.",
  win: "Completed my first week at Sunrise Care through MyHiredito. Great team!",
};

function PostModal({
  kind,
  onClose,
  userKey,
}: {
  kind: WorkerActivityType;
  onClose: () => void;
  userKey: string;
}) {
  const [body, setBody] = useState("");
  const titles: Record<WorkerActivityType, string> = {
    availability: "Share your availability",
    credential: "Share a credential update",
    win: "Share a shift win",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    createWorkerPost(userKey, kind, body);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-zinc-900">{titles[kind]}</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className={authFieldClass}
            placeholder={PLACEHOLDERS[kind]}
            required
          />
          <button type="submit" className={authButtonClass}>
            Post to feed
          </button>
        </form>
      </div>
    </div>
  );
}

export function WorkerHomeComposer() {
  const { user } = useWorkerAuth();
  const { progress, loading } = useWorkerOnboarding();
  const [modal, setModal] = useState<ModalKind>(null);

  const name = user ? getWorkerDisplayName(user) : "Worker";
  const userKey = getWorkerUserKey(user);
  const canPost = !loading && isOnboardingComplete(progress);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1db954] text-sm font-bold text-white">
            {name.charAt(0)}
          </div>
          <button
            type="button"
            onClick={() => canPost && setModal("availability")}
            disabled={!canPost}
            className={`flex-1 rounded-full border px-4 py-3 text-left text-sm font-semibold transition ${
              canPost
                ? "border-zinc-300 text-zinc-500 hover:border-[#1db954] hover:bg-zinc-50"
                : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
            }`}
          >
            {canPost
              ? "Share your availability..."
              : "Complete onboarding to post updates..."}
          </button>
        </div>

        <div className="flex border-t border-zinc-200">
          <button
            type="button"
            onClick={() => canPost && setModal("availability")}
            disabled={!canPost}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-[#1db954]">📅</span>
            Open to work
          </button>
          <button
            type="button"
            onClick={() => canPost && setModal("credential")}
            disabled={!canPost}
            className="flex flex-1 items-center justify-center gap-2 border-l border-zinc-200 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-blue-500">📜</span>
            Cert update
          </button>
          <button
            type="button"
            onClick={() => canPost && setModal("win")}
            disabled={!canPost}
            className="flex flex-1 items-center justify-center gap-2 border-l border-zinc-200 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-amber-500">🏆</span>
            Shift win
          </button>
        </div>
      </div>

      {modal && userKey && (
        <PostModal kind={modal} onClose={() => setModal(null)} userKey={userKey} />
      )}
    </>
  );
}
