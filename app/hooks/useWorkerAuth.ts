"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getWorkerAuthUser,
  signOutWorker,
  type WorkerAuthUser,
} from "@/app/lib/workerAuth";

export function useWorkerAuth() {
  const [user, setUser] = useState<WorkerAuthUser | null | undefined>(
    undefined,
  );

  const refresh = useCallback(async () => {
    const nextUser = await getWorkerAuthUser();
    setUser(nextUser);
  }, []);

  useEffect(() => {
    refresh();

    function onAuthChange() {
      refresh();
    }

    window.addEventListener("myhiredito-worker-auth", onAuthChange);
    window.addEventListener("storage", onAuthChange);
    return () => {
      window.removeEventListener("myhiredito-worker-auth", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, [refresh]);

  async function signOut() {
    await signOutWorker();
    setUser(null);
  }

  return {
    user: user ?? null,
    loading: user === undefined,
    authenticated: !!user,
    refresh,
    signOut,
  };
}
