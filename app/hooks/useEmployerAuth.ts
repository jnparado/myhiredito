"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/env";
import {
  getEmployerAuthUser,
  getEmployerUserId,
  signOutEmployer,
  type EmployerAuthUser,
} from "@/app/lib/employerAuth";
import {
  hydrateEmployerOnboardingFromDb,
  setEmployerOnboardingSyncUserId,
} from "@/app/lib/employerOnboarding";

export function useEmployerAuth() {
  const [user, setUser] = useState<EmployerAuthUser | null | undefined>(
    undefined,
  );

  const refresh = useCallback(async () => {
    const nextUser = await getEmployerAuthUser();
    setUser(nextUser);

    const userId = getEmployerUserId(nextUser);
    setEmployerOnboardingSyncUserId(userId);
    if (userId) {
      await hydrateEmployerOnboardingFromDb(userId);
    }
  }, []);

  useEffect(() => {
    refresh();

    function onAuthChange() {
      refresh();
    }

    window.addEventListener("myhiredito-employer-auth", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        refresh();
      });

      return () => {
        subscription.unsubscribe();
        window.removeEventListener("myhiredito-employer-auth", onAuthChange);
        window.removeEventListener("storage", onAuthChange);
      };
    }

    return () => {
      window.removeEventListener("myhiredito-employer-auth", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, [refresh]);

  async function signOut() {
    await signOutEmployer();
    setEmployerOnboardingSyncUserId(null);
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
