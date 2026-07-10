export type MessageSender = "worker" | "employer" | "support" | "recruiter";

export type ChatMessage = {
  id: string;
  sender: MessageSender;
  senderName: string;
  body: string;
  sentAt: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  participantName: string;
  participantRole: "employer" | "support" | "recruiter";
  company?: string;
  jobTitle?: string;
  avatarColor: string;
  messages: ChatMessage[];
  updatedAt: string;
};

const STORAGE_PREFIX = "myhiredito_messages_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function messageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function conversationId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultConversations(): Conversation[] {
  const hour = 60 * 60 * 1000;
  const now = Date.now();

  return [
    {
      id: "conv-sunrise-care",
      participantName: "Maria Lopez",
      participantRole: "employer",
      company: "Sunrise Senior Care",
      jobTitle: "Certified Nursing Assistant (CNA)",
      avatarColor: "#00b074",
      updatedAt: new Date(now - hour * 2).toISOString(),
      messages: [
        {
          id: messageId(),
          sender: "employer",
          senderName: "Maria Lopez",
          body: "Hi Alex! We reviewed your CNA application and your role exam score looks great. Are you available for a quick phone screen this week?",
          sentAt: new Date(now - hour * 2).toISOString(),
          read: false,
        },
      ],
    },
    {
      id: "conv-metro-hospital",
      participantName: "James Chen",
      participantRole: "recruiter",
      company: "Metro General Hospital",
      jobTitle: "Registered Nurse — ICU",
      avatarColor: "#337ab7",
      updatedAt: new Date(now - hour * 26).toISOString(),
      messages: [
        {
          id: messageId(),
          sender: "recruiter",
          senderName: "James Chen",
          body: "Thanks for applying to our ICU role. Can you confirm your ACLS certification expiration date?",
          sentAt: new Date(now - hour * 26).toISOString(),
          read: true,
        },
        {
          id: messageId(),
          sender: "worker",
          senderName: "You",
          body: "Yes — ACLS is current through March 2027. Happy to send a copy if needed.",
          sentAt: new Date(now - hour * 25).toISOString(),
          read: true,
        },
      ],
    },
    {
      id: "conv-support",
      participantName: "MyHiredito Support",
      participantRole: "support",
      company: "MyHiredito",
      avatarColor: "#0f1115",
      updatedAt: new Date(now - hour * 48).toISOString(),
      messages: [
        {
          id: messageId(),
          sender: "support",
          senderName: "MyHiredito Support",
          body: "Welcome to MyHiredito! Complete your onboarding and take role exams to boost your applications. Employers can message you here once you apply.",
          sentAt: new Date(now - hour * 48).toISOString(),
          read: true,
        },
      ],
    },
  ];
}

function saveConversations(userKey: string, conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(conversations));
  window.dispatchEvent(new Event("myhiredito-messages"));
}

export function ensureDemoConversations(userKey: string): Conversation[] {
  const existing = getConversations(userKey);
  if (existing.length > 0) return existing;

  const seeded = defaultConversations();
  saveConversations(userKey, seeded);
  return seeded;
}

export function getConversations(userKey: string): Conversation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Conversation[];
    return parsed.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch {
    return [];
  }
}

export function getConversation(
  userKey: string,
  conversationIdValue: string,
): Conversation | null {
  return (
    getConversations(userKey).find((item) => item.id === conversationIdValue) ??
    null
  );
}

export function getUnreadMessageCount(userKey: string): number {
  return getConversations(userKey).reduce((total, conversation) => {
    return (
      total +
      conversation.messages.filter(
        (message) => !message.read && message.sender !== "worker",
      ).length
    );
  }, 0);
}

export function markConversationRead(
  userKey: string,
  conversationIdValue: string,
): void {
  const conversations = getConversations(userKey).map((conversation) => {
    if (conversation.id !== conversationIdValue) return conversation;
    return {
      ...conversation,
      messages: conversation.messages.map((message) =>
        message.sender === "worker" ? message : { ...message, read: true },
      ),
    };
  });
  saveConversations(userKey, conversations);
}

export function sendMessage(
  userKey: string,
  conversationIdValue: string,
  body: string,
  workerName = "You",
): ChatMessage | null {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const message: ChatMessage = {
    id: messageId(),
    sender: "worker",
    senderName: workerName,
    body: trimmed,
    sentAt: nowIso(),
    read: true,
  };

  const conversations = getConversations(userKey).map((conversation) => {
    if (conversation.id !== conversationIdValue) return conversation;
    return {
      ...conversation,
      messages: [...conversation.messages, message],
      updatedAt: message.sentAt,
    };
  });

  saveConversations(userKey, conversations);
  return message;
}

export function getOrCreateEmployerConversation(
  userKey: string,
  company: string,
  jobTitle: string,
): string {
  const conversations = ensureDemoConversations(userKey);
  const slug = `${company}-${jobTitle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const existing = conversations.find(
    (conversation) =>
      conversation.company === company && conversation.jobTitle === jobTitle,
  );
  if (existing) return existing.id;

  const created: Conversation = {
    id: `conv-${slug}`,
    participantName: `${company} Hiring Team`,
    participantRole: "employer",
    company,
    jobTitle,
    avatarColor: "#00b074",
    updatedAt: nowIso(),
    messages: [],
  };

  saveConversations(userKey, [created, ...conversations]);
  return created.id;
}

export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (diffHours < 48) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function getConversationPreview(conversation: Conversation): string {
  const last = conversation.messages[conversation.messages.length - 1];
  if (!last) return "No messages yet — say hello!";
  return last.body;
}

export function getConversationUnreadCount(conversation: Conversation): number {
  return conversation.messages.filter(
    (message) => !message.read && message.sender !== "worker",
  ).length;
}
