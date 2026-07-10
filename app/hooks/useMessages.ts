"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkerAuth } from "./useWorkerAuth";
import { getWorkerUserKey } from "@/app/lib/workerOnboarding";
import {
  ensureDemoConversations,
  getConversations,
  getUnreadMessageCount,
  type Conversation,
} from "@/app/lib/messages";

export function useMessages() {
  const { user, loading: authLoading } = useWorkerAuth();
  const userKey = getWorkerUserKey(user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!userKey) {
      setConversations([]);
      setUnreadCount(0);
      setReady(!authLoading);
      return;
    }

    const list = ensureDemoConversations(userKey);
    setConversations(list);
    setUnreadCount(getUnreadMessageCount(userKey));
    setReady(true);
  }, [authLoading, userKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onChange() {
      refresh();
    }

    window.addEventListener("myhiredito-messages", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("myhiredito-messages", onChange);
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
