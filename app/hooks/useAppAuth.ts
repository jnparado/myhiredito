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

    if (!getCachedAppAuthState()) {
      void refreshAppAuthState().then((next) => {
        if (mounted) setState(next);
      });
    }

    function onAuthChange() {
      void refreshAppAuthState().then((next) => {
        if (mounted) setState(next);
      });
    }

    const unsubscribe = subscribeAppAuthState(onAuthChange);

    window.addEventListener("myhiredito-worker-auth", onAuthChange);
    window.addEventListener("myhiredito-employer-auth", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      const { data } = supabase.auth.onAuthStateChange(() => {
        onAuthChange();
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      unsubscribe();
      window.removeEventListener("myhiredito-worker-auth", onAuthChange);
      window.removeEventListener("myhiredito-employer-auth", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
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
