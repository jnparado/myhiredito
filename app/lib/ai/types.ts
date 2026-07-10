export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type WorkerContext = {
  displayName: string;
  skills: string[];
  location?: string;
  availability?: string;
  headline?: string;
  onboardingComplete: boolean;
  completedSteps: string[];
};

export type JobMatchInput = {
  slug: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  skills: string[];
  description: string;
  experienceLevel: string;
};

export type JobMatchResult = {
  slug: string;
  score: number;
  label: "Excellent" | "Strong" | "Good" | "Fair";
  reasons: string[];
  source: "ai" | "heuristic";
};

export type JobDraftInput = {
  title: string;
  category: string;
  location: string;
  pay: string;
  schedule?: string;
  companyName: string;
};

export type JobDraftResult = {
  description: string;
  requirements: string;
  skills: string;
  schedule: string;
  source: "ai" | "template";
};
