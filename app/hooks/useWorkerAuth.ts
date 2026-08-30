"use client";

import { useAppAuth } from "./useAppAuth";
import { signOutWorker } from "@/app/lib/workerAuth";
import { applySignedOutRole } from "@/app/lib/authState";
import { setLastAuthRole } from "@/app/lib/authRole";

export function useWorkerAuth() {
  const { loading, refresh, worker } = useAppAuth();

  async function signOut() {
    setLastAuthRole("worker");
    applySignedOutRole("worker");
    await signOutWorker();
    await refresh();
  }

  return {
    user: worker.user,
    loading,
    authenticated: worker.authenticated,
    refresh,
    signOut,
  };
}
