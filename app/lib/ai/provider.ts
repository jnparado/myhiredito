import { getOpenAiApiKey, getOpenAiModel, isAiConfigured } from "./config";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function completeChat(
  messages: ChatMessage[],
  options?: { json?: boolean; temperature?: number },
): Promise<string> {
  if (!isAiConfigured()) {
    throw new Error("AI is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      messages,
      temperature: options?.temperature ?? 0.4,
      ...(options?.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI request failed: ${response.status} ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("AI returned an empty response");
  return content;
}

export function parseJsonArray<T>(raw: string): T[] {
  const parsed = JSON.parse(raw) as T[] | { results?: T[]; matches?: T[] };
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.results)) return parsed.results;
  if (Array.isArray(parsed.matches)) return parsed.matches;
  throw new Error("Expected JSON array from AI");
}
