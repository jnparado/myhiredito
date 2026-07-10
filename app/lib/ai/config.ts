export function getOpenAiApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY;
}

export function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

export function isAiConfigured(): boolean {
  return Boolean(getOpenAiApiKey());
}
