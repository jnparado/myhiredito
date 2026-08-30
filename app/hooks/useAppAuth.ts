"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/env";
import {
  getCachedAppAuthState,
  refreshAppAuthState,
  subscribeAppAuthState,
  type ResolvedAppAuth,
} from "@/app/lib/authState";

type RoleAuth<T> = {
  user: T | null;
  authenticated: boolean;
};

const AUTH_STORAGE_KEYS = new Set([
  "myhiredito_worker_demo_session",
  "myhiredito_employer_demo_session",
]);

function isAuthStorageKey(key: string | null): boolean {
  if (!key) return false;
  if (AUTH_STORAGE_KEYS.has(key)) return true;
  return key.includes("auth-token") || key.startsWith("sb-");
}

export function useAppAuth() {
  const [state, setState] = useState<ResolvedAppAuth | undefined>(
    getCachedAppAuthState,
  );

  const refresh = useCallback(async () => {
    const next = await refreshAppAuthState();
    setState(next);
    return next;
  }, []);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeAppAuthState((next) => {
      if (mounted) setState(next);
    });

    if (!getCachedAppAuthState()) {
      void refreshAppAuthState().then((next) => {
        if (mounted) setState(next);
      });
    }

    function onAuthEvent() {
      void refreshAppAuthState();
    }

    function onStorage(event: StorageEvent) {
      if (!isAuthStorageKey(event.key)) return;
      onAuthEvent();
    }

    window.addEventListener("myhiredito-worker-auth", onAuthEvent);
    window.addEventListener("myhiredito-employer-auth", onAuthEvent);
    window.addEventListener("storage", onStorage);

    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      const { data } = supabase.auth.onAuthStateChange((event: string) => {
        if (event === "INITIAL_SESSION") return;
        onAuthEvent();
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      unsubscribe();
      window.removeEventListener("myhiredito-worker-auth", onAuthEvent);
      window.removeEventListener("myhiredito-employer-auth", onAuthEvent);
      window.removeEventListener("storage", onStorage);
      subscription?.unsubscribe();
    };
  }, []);

  const loading = state === undefined;

  return {
    loading,
    refresh,
    worker: {
      user: state?.worker ?? null,
      authenticated: !!state?.worker,
    } satisfies RoleAuth<NonNullable<ResolvedAppAuth["worker"]>>,
    employer: {
      user: state?.employer ?? null,
      authenticated: !!state?.employer,
    } satisfies RoleAuth<NonNullable<ResolvedAppAuth["employer"]>>,
  };
}
