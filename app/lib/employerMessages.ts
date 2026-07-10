export type EmployerMessageSender = "employer" | "worker" | "support";

export type EmployerChatMessage = {
  id: string;
  sender: EmployerMessageSender;
  senderName: string;
  body: string;
  sentAt: string;
  read: boolean;
};

export type EmployerConversation = {
  id: string;
  participantName: string;
  participantRole: "worker" | "support";
  jobTitle?: string;
  skills?: string;
  avatarColor: string;
  messages: EmployerChatMessage[];
  updatedAt: string;
};

const STORAGE_PREFIX = "myhiredito_employer_messages_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function messageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultEmployerConversations(): EmployerConversation[] {
  const hour = 60 * 60 * 1000;
  const now = Date.now();

  return [
    {
      id: "conv-alex-rivera",
      participantName: "Alex Rivera",
      participantRole: "worker",
      jobTitle: "Certified Nursing Assistant (CNA)",
      skills: "CNA · Patient Care · CPR",
      avatarColor: "#337ab7",
      updatedAt: new Date(now - hour * 3).toISOString(),
      messages: [
        {
          id: messageId(),
          sender: "worker",
          senderName: "Alex Rivera",
          body: "Hi! I applied for the CNA role and completed the role exam. I'm available for day and evening shifts this week.",
          sentAt: new Date(now - hour * 3).toISOString(),
          read: false,
        },
      ],
    },
    {
      id: "conv-maria-santos",
      participantName: "Maria Santos",
      participantRole: "worker",
      jobTitle: "Registered Nurse (RN)",
      skills: "RN · ICU · ACLS",
      avatarColor: "#5cb85c",
      updatedAt: new Date(now - hour * 20).toISOString(),
      messages: [
        {
          id: messageId(),
          sender: "employer",
          senderName: "You",
          body: "Thanks for applying, Maria. Can you confirm your ACLS certification expiration date?",
          sentAt: new Date(now - hour * 22).toISOString(),
          read: true,
        },
        {
          id: messageId(),
          sender: "worker",
          senderName: "Maria Santos",
          body: "Yes — ACLS is current through March 2027. I can send a copy if needed.",
          sentAt: new Date(now - hour * 20).toISOString(),
          read: true,
        },
      ],
    },
    {
      id: "conv-employer-support",
      participantName: "MyHiredito Support",
      participantRole: "support",
      avatarColor: "#0f1115",
      updatedAt: new Date(now - hour * 72).toISOString(),
      messages: [
        {
          id: messageId(),
          sender: "support",
          senderName: "MyHiredito Support",
          body: "Welcome! Message applicants here after they apply to your jobs. Complete onboarding to unlock job posting.",
          sentAt: new Date(now - hour * 72).toISOString(),
          read: true,
        },
      ],
    },
  ];
}

function saveConversations(
  userKey: string,
  conversations: EmployerConversation[],
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(conversations));
  window.dispatchEvent(new Event("myhiredito-employer-messages"));
}

export function ensureEmployerConversations(
  userKey: string,
): EmployerConversation[] {
  const existing = getEmployerConversations(userKey);
  if (existing.length > 0) return existing;

  const seeded = defaultEmployerConversations();
  saveConversations(userKey, seeded);
  return seeded;
}

export function getEmployerConversations(
  userKey: string,
): EmployerConversation[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as EmployerConversation[];
    return parsed.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch {
    return [];
  }
}

export function getEmployerConversation(
  userKey: string,
  conversationId: string,
): EmployerConversation | null {
  return (
    getEmployerConversations(userKey).find(
      (item) => item.id === conversationId,
    ) ?? null
  );
}

export function getEmployerUnreadMessageCount(userKey: string): number {
  return getEmployerConversations(userKey).reduce((total, conversation) => {
    return (
      total +
      conversation.messages.filter(
        (message) => !message.read && message.sender !== "employer",
      ).length
    );
  }, 0);
}

export function markEmployerConversationRead(
  userKey: string,
  conversationId: string,
): void {
  const conversations = getEmployerConversations(userKey).map((conversation) => {
    if (conversation.id !== conversationId) return conversation;
    return {
      ...conversation,
      messages: conversation.messages.map((message) =>
        message.sender === "employer" ? message : { ...message, read: true },
      ),
    };
  });
  saveConversations(userKey, conversations);
}

export function sendEmployerMessage(
  userKey: string,
  conversationId: string,
  body: string,
  employerName = "You",
): EmployerChatMessage | null {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const message: EmployerChatMessage = {
    id: messageId(),
    sender: "employer",
    senderName: employerName,
    body: trimmed,
    sentAt: nowIso(),
    read: true,
  };

  const conversations = getEmployerConversations(userKey).map((conversation) => {
    if (conversation.id !== conversationId) return conversation;
    return {
      ...conversation,
      messages: [...conversation.messages, message],
      updatedAt: message.sentAt,
    };
  });

  saveConversations(userKey, conversations);
  return message;
}

export function getEmployerConversationPreview(
  conversation: EmployerConversation,
): string {
  const last = conversation.messages[conversation.messages.length - 1];
  if (!last) return "No messages yet — reach out to this applicant.";
  return last.body;
}

export function getEmployerConversationUnreadCount(
  conversation: EmployerConversation,
): number {
  return conversation.messages.filter(
    (message) => !message.read && message.sender !== "employer",
  ).length;
}

export { formatMessageTime } from "./messages";

export function createEmployerConversationFromApplicant(
  userKey: string,
  applicant: {
    id: string;
    workerName: string;
    jobTitle?: string;
    skills?: string;
  },
): string {
  const conversations = ensureEmployerConversations(userKey);
  const convId = `conv-${applicant.id}`;
  const existing = conversations.find((c) => c.id === convId);
  if (existing) return existing.id;

  const created: EmployerConversation = {
    id: convId,
    participantName: applicant.workerName,
    participantRole: "worker",
    jobTitle: applicant.jobTitle,
    skills: applicant.skills,
    avatarColor: "#337ab7",
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  saveConversations(userKey, [created, ...conversations]);
  return convId;
}
