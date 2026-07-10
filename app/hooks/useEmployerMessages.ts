"use client";

import { useCallback, useEffect, useState } from "react";
import { useEmployerAuth } from "./useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  ensureEmployerConversations,
  getEmployerConversations,
  getEmployerUnreadMessageCount,
  type EmployerConversation,
} from "@/app/lib/employerMessages";

export function useEmployerMessages() {
  const { user, loading: authLoading } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [conversations, setConversations] = useState<EmployerConversation[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setConversations([]);
      setUnreadCount(0);
      setReady(!authLoading);
      return;
    }

    const list = ensureEmployerConversations(userKey);
    setConversations(list);
    setUnreadCount(getEmployerUnreadMessageCount(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }

    window.addEventListener("myhiredito-employer-messages", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-employer-messages", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    userKey,
    conversations,
    unreadCount,
    loading: authLoading || !ready,
    refresh,
  };
}
