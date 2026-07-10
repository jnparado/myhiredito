import type { Job } from "./jobs";

export type AssessmentQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type AssessmentTier = "strong" | "good" | "practice";

export type AssessmentResult = {
  jobSlug: string;
  jobTitle: string;
  category: string;
  score: number;
  total: number;
  percent: number;
  tier: AssessmentTier;
  completedAt: string;
};

const categoryAssessments: Record<string, AssessmentQuestion[]> = {
  Healthcare: [
    {
      id: "hc-1",
      question:
        "A resident becomes suddenly confused and unsteady. What should you do first?",
      options: [
        "Help them walk to the restroom alone",
        "Call for nursing staff and stay with the resident",
        "Document it at the end of your shift",
        "Give them water and wait",
      ],
      correctIndex: 1,
      explanation:
        "Safety first — alert the nurse and remain with the resident until help arrives.",
    },
    {
      id: "hc-2",
      question: "What is the correct order for donning PPE?",
      options: [
        "Gloves, gown, mask, eye protection",
        "Gown, mask, eye protection, gloves",
        "Mask, gloves, gown, eye protection",
        "Eye protection, gloves, gown, mask",
      ],
      correctIndex: 1,
      explanation:
        "Standard sequence: gown, mask/respirator, eye protection, then gloves.",
    },
    {
      id: "hc-3",
      question:
        "Which action best supports infection control in patient care?",
      options: [
        "Reuse gloves between rooms if they look clean",
        "Perform hand hygiene before and after resident contact",
        "Store used linens on the food cart",
        "Skip gloves when helping with meals",
      ],
      correctIndex: 1,
      explanation: "Hand hygiene is the foundation of infection prevention.",
    },
    {
      id: "hc-4",
      question: "A patient refuses assistance with bathing. You should:",
      options: [
        "Force the care plan immediately",
        "Respect their choice and report concerns to the nurse",
        "Ignore the refusal and continue",
        "Leave without telling anyone",
      ],
      correctIndex: 1,
      explanation:
        "Respect autonomy while escalating safety or health concerns to nursing staff.",
    },
    {
      id: "hc-5",
      question: "Vital signs should be reported promptly when:",
      options: [
        "They match yesterday exactly",
        "There is a significant change from baseline",
        "The resident asks you not to",
        "You are busy with another task",
      ],
      correctIndex: 1,
      explanation:
        "Changes in vitals can signal deterioration and require timely reporting.",
    },
  ],
  "Web & Mobile": [
    {
      id: "wm-1",
      question: "In React, what is the main purpose of `useEffect`?",
      options: [
        "Style components",
        "Run side effects after render",
        "Create context providers",
        "Replace state management",
      ],
      correctIndex: 1,
      explanation: "`useEffect` handles side effects like data fetching and subscriptions.",
    },
    {
      id: "wm-2",
      question: "Which HTTP method is typically used to update an existing resource?",
      options: ["GET", "POST", "PUT/PATCH", "OPTIONS"],
      correctIndex: 2,
      explanation: "PUT or PATCH updates existing resources; POST often creates new ones.",
    },
    {
      id: "wm-3",
      question: "What does TypeScript add on top of JavaScript?",
      options: [
        "Static typing",
        "Faster runtime execution",
        "Built-in database access",
        "Automatic CSS generation",
      ],
      correctIndex: 0,
      explanation: "TypeScript adds static types that are checked at compile time.",
    },
    {
      id: "wm-4",
      question: "A good first step when a production bug is reported is to:",
      options: [
        "Redeploy immediately without investigation",
        "Reproduce the issue and gather logs",
        "Delete recent commits",
        "Disable user authentication",
      ],
      correctIndex: 1,
      explanation: "Reproducing and logging helps you fix the root cause safely.",
    },
    {
      id: "wm-5",
      question: "Which practice improves API security in a web app?",
      options: [
        "Store secrets in frontend code",
        "Validate and sanitize all user input",
        "Disable HTTPS in development forever",
        "Share admin tokens in chat",
      ],
      correctIndex: 1,
      explanation: "Input validation and sanitization reduce injection and abuse risks.",
    },
  ],
  "Design & Creative": [
    {
      id: "dc-1",
      question: "What is the primary goal of a wireframe?",
      options: [
        "Final visual polish",
        "Layout and structure without visual detail",
        "Copywriting only",
        "Developer deployment",
      ],
      correctIndex: 1,
      explanation: "Wireframes focus on structure, hierarchy, and flow.",
    },
    {
      id: "dc-2",
      question: "Strong contrast in UI design mainly improves:",
      options: ["Animation speed", "Readability and accessibility", "File size", "SEO ranking"],
      correctIndex: 1,
      explanation: "Contrast helps users read content and meet accessibility standards.",
    },
    {
      id: "dc-3",
      question: "A design system helps teams by:",
      options: [
        "Removing the need for designers",
        "Creating consistent reusable components",
        "Blocking user feedback",
        "Avoiding brand guidelines",
      ],
      correctIndex: 1,
      explanation: "Design systems standardize components and patterns across products.",
    },
    {
      id: "dc-4",
      question: "Before presenting concepts to stakeholders, you should:",
      options: [
        "Skip user goals",
        "Tie designs back to user and business goals",
        "Hide constraints",
        "Use only one option",
      ],
      correctIndex: 1,
      explanation: "Connecting design decisions to goals builds trust and alignment.",
    },
    {
      id: "dc-5",
      question: "Which file format is best for scalable logos?",
      options: ["JPEG", "PNG only", "SVG", "GIF"],
      correctIndex: 2,
      explanation: "SVG scales cleanly at any size and works well for logos and icons.",
    },
  ],
  Writing: [
    {
      id: "wr-1",
      question: "The best headline for a job landing page should:",
      options: [
        "Use vague buzzwords only",
        "Clearly state the audience benefit",
        "Be as long as possible",
        "Avoid the product name",
      ],
      correctIndex: 1,
      explanation: "Benefit-driven headlines communicate value quickly.",
    },
    {
      id: "wr-2",
      question: "Active voice usually makes copy:",
      options: ["Harder to read", "More direct and engaging", "Legally required", "Slower to scan"],
      correctIndex: 1,
      explanation: "Active voice is clearer and more energetic for most marketing copy.",
    },
    {
      id: "wr-3",
      question: "When editing, your first priority should be:",
      options: ["Font choice", "Clarity and accuracy", "Adding more adjectives", "Keyword stuffing"],
      correctIndex: 1,
      explanation: "Clear, accurate messaging comes before style flourishes.",
    },
    {
      id: "wr-4",
      question: "A content brief should include:",
      options: [
        "Audience, goal, tone, and key points",
        "Only word count",
        "Personal opinions only",
        "No deadline",
      ],
      correctIndex: 0,
      explanation: "Briefs align writers on audience, goals, tone, and deliverables.",
    },
    {
      id: "wr-5",
      question: "Plagiarism in professional writing means:",
      options: [
        "Citing sources properly",
        "Using others' work without credit",
        "Rewriting in your own words",
        "Interviewing experts",
      ],
      correctIndex: 1,
      explanation: "Uncredited use of others' work violates professional standards.",
    },
  ],
  "Sales & Marketing": [
    {
      id: "sm-1",
      question: "A qualified lead typically means the prospect:",
      options: [
        "Opened one email",
        "Matches ICP and shows buying intent",
        "Visited the homepage once",
        "Follows social media only",
      ],
      correctIndex: 1,
      explanation: "Qualification combines fit with intent and readiness to buy.",
    },
    {
      id: "sm-2",
      question: "What does CTR measure in a campaign?",
      options: [
        "Total revenue",
        "Click-through rate",
        "Customer churn",
        "Server uptime",
      ],
      correctIndex: 1,
      explanation: "CTR is the percentage of people who click after seeing an ad or email.",
    },
    {
      id: "sm-3",
      question: "The best follow-up after a demo is to:",
      options: [
        "Wait indefinitely",
        "Summarize value and propose next steps",
        "Send unrelated content",
        "Lower price without discussion",
      ],
      correctIndex: 1,
      explanation: "A concise recap plus clear next steps keeps momentum.",
    },
    {
      id: "sm-4",
      question: "A/B testing helps marketers:",
      options: [
        "Avoid all experiments",
        "Compare two variants with data",
        "Remove analytics",
        "Guess audience preferences",
      ],
      correctIndex: 1,
      explanation: "Controlled tests reveal which variant performs better.",
    },
    {
      id: "sm-5",
      question: "Brand voice should be:",
      options: [
        "Random per post",
        "Consistent with audience expectations",
        "Identical to every competitor",
        "Ignored in social media",
      ],
      correctIndex: 1,
      explanation: "Consistent voice builds recognition and trust.",
    },
  ],
  "Admin Support": [
    {
      id: "as-1",
      question: "When scheduling meetings across time zones, you should:",
      options: [
        "Use only your local time",
        "Confirm times in each attendee's zone",
        "Skip calendar invites",
        "Book without agendas",
      ],
      correctIndex: 1,
      explanation: "Timezone clarity prevents missed meetings and frustration.",
    },
    {
      id: "as-2",
      question: "Sensitive documents should be stored:",
      options: [
        "In public shared folders",
        "In access-controlled secure locations",
        "On personal USB drives only",
        "In email drafts forever",
      ],
      correctIndex: 1,
      explanation: "Role-based access protects confidential information.",
    },
    {
      id: "as-3",
      question: "A well-organized inbox strategy includes:",
      options: [
        "Never archiving",
        "Labels, priorities, and response SLAs",
        "Deleting all unread mail",
        "Forwarding everything to one person",
      ],
      correctIndex: 1,
      explanation: "Structure and priorities keep executive support reliable.",
    },
    {
      id: "as-4",
      question: "Travel booking for an executive should verify:",
      options: [
        "Only flight color",
        "Budget, preferences, and backup options",
        "Social media trends",
        "Office plant schedule",
      ],
      correctIndex: 1,
      explanation: "Preferences, policy, and contingencies prevent travel issues.",
    },
    {
      id: "as-5",
      question: "Meeting notes should capture:",
      options: [
        "Decisions, owners, and deadlines",
        "Only jokes from the call",
        "Nothing actionable",
        "Personal gossip",
      ],
      correctIndex: 0,
      explanation: "Actionable notes drive accountability after meetings.",
    },
  ],
  "Customer Service": [
    {
      id: "cs-1",
      question: "When a customer is upset, first you should:",
      options: [
        "Argue policy immediately",
        "Listen, acknowledge, and clarify the issue",
        "Transfer without context",
        "End the chat quickly",
      ],
      correctIndex: 1,
      explanation: "Empathy and clarity de-escalate and uncover the real problem.",
    },
    {
      id: "cs-2",
      question: "First response time is important because it:",
      options: [
        "Replaces product quality",
        "Sets expectations for support experience",
        "Eliminates refunds",
        "Hides bugs",
      ],
      correctIndex: 1,
      explanation: "Fast acknowledgment improves satisfaction even before resolution.",
    },
    {
      id: "cs-3",
      question: "If you don't know the answer, you should:",
      options: [
        "Guess confidently",
        "Set expectations and follow up with accurate info",
        "Ignore the ticket",
        "Close the ticket silently",
      ],
      correctIndex: 1,
      explanation: "Honest timelines beat incorrect answers in support.",
    },
    {
      id: "cs-4",
      question: "Escalation is appropriate when:",
      options: [
        "The issue exceeds your authority or expertise",
        "The customer says please",
        "You are tired",
        "It's almost lunch",
      ],
      correctIndex: 0,
      explanation: "Escalate when policy, severity, or expertise requires it.",
    },
    {
      id: "cs-5",
      question: "A good support macro should be:",
      options: [
        "Personalizable and accurate",
        "Identical for every industry",
        "Full of jargon only",
        "Longer than the policy manual",
      ],
      correctIndex: 0,
      explanation: "Templates save time but still need context-specific accuracy.",
    },
  ],
  "Data & Analytics": [
    {
      id: "da-1",
      question: "A KPI should be:",
      options: [
        "Unrelated to business goals",
        "Measurable and tied to outcomes",
        "Secret from stakeholders",
        "Changed daily without reason",
      ],
      correctIndex: 1,
      explanation: "KPIs track measurable progress toward business objectives.",
    },
    {
      id: "da-2",
      question: "Correlation does not necessarily mean:",
      options: ["Causation", "A relationship exists", "Two metrics move together", "Further analysis is needed"],
      correctIndex: 0,
      explanation: "Correlated variables may not cause one another.",
    },
    {
      id: "da-3",
      question: "Before building a dashboard, you should:",
      options: [
        "Add every metric available",
        "Define audience questions and decisions",
        "Skip data validation",
        "Hide data sources",
      ],
      correctIndex: 1,
      explanation: "Dashboards should answer specific user decisions.",
    },
    {
      id: "da-4",
      question: "SQL `GROUP BY` is used to:",
      options: [
        "Delete tables",
        "Aggregate rows by a shared attribute",
        "Encrypt databases",
        "Send emails",
      ],
      correctIndex: 1,
      explanation: "`GROUP BY` aggregates data across shared values.",
    },
    {
      id: "da-5",
      question: "Data quality issues should be:",
      options: [
        "Documented and addressed at the source",
        "Hidden in final reports",
        "Ignored if charts look good",
        "Blamed on end users only",
      ],
      correctIndex: 0,
      explanation: "Reliable analysis depends on fixing quality at the source.",
    },
  ],
  Accounting: [
    {
      id: "ac-1",
      question: "Accounts payable tracks:",
      options: [
        "Money owed to suppliers",
        "Employee vacation days",
        "Marketing impressions",
        "Website traffic",
      ],
      correctIndex: 0,
      explanation: "AP represents short-term obligations to vendors.",
    },
    {
      id: "ac-2",
      question: "Bank reconciliations help you:",
      options: [
        "Match books to bank statements",
        "Avoid all audits",
        "Skip expense policies",
        "Hide transactions",
      ],
      correctIndex: 0,
      explanation: "Reconciliation catches errors, fraud, and timing differences.",
    },
    {
      id: "ac-3",
      question: "A debit to an expense account:",
      options: [
        "Increases expense",
        "Always decreases cash only",
        "Is never used in bookkeeping",
        "Replaces invoices",
      ],
      correctIndex: 0,
      explanation: "Expenses normally increase with debits under double-entry accounting.",
    },
    {
      id: "ac-4",
      question: "Supporting documents for reimbursements should be:",
      options: [
        "Complete, legible, and policy-compliant",
        "Optional for large amounts",
        "Submitted years later",
        "Shared publicly",
      ],
      correctIndex: 0,
      explanation: "Proper documentation supports audit-ready reimbursements.",
    },
    {
      id: "ac-5",
      question: "Month-end close priorities include:",
      options: [
        "Accruals, reconciliations, and review",
        "Deleting prior months",
        "Skipping journal entries",
        "Ignoring variances",
      ],
      correctIndex: 0,
      explanation: "Close procedures ensure accurate, timely financial reporting.",
    },
  ],
};

const defaultAssessment: AssessmentQuestion[] = [
  {
    id: "gen-1",
    question: "Before starting a new role, you should clarify:",
    options: [
      "Only your lunch break",
      "Expectations, schedule, and success metrics",
      "Coworkers' personal lives",
      "Nothing until month two",
    ],
    correctIndex: 1,
    explanation: "Clear expectations set you up for success from day one.",
  },
  {
    id: "gen-2",
    question: "Professional communication should be:",
    options: ["Clear, respectful, and timely", "Aggressive", "Vague", "Delayed without reason"],
    correctIndex: 0,
    explanation: "Clarity and respect build trust with employers.",
  },
  {
    id: "gen-3",
    question: "If you cannot complete a task on time, you should:",
    options: [
      "Say nothing",
      "Notify the employer early with a plan",
      "Blame others publicly",
      "Delete the assignment",
    ],
    correctIndex: 1,
    explanation: "Early communication helps teams adjust and maintain trust.",
  },
  {
    id: "gen-4",
    question: "Confidential workplace information should be:",
    options: [
      "Shared on social media",
      "Protected and shared only when authorized",
      "Sold to competitors",
      "Emailed to personal accounts",
    ],
    correctIndex: 1,
    explanation: "Protecting confidential data is a core professional responsibility.",
  },
  {
    id: "gen-5",
    question: "Showing up prepared for a shift or interview means:",
    options: [
      "Arriving on time with required credentials",
      "Arriving whenever convenient",
      "Skipping required documents",
      "Ignoring dress code",
    ],
    correctIndex: 0,
    explanation: "Punctuality and preparation signal reliability to employers.",
  },
];

export function getAssessmentForJob(job: Job): AssessmentQuestion[] {
  return categoryAssessments[job.category] ?? defaultAssessment;
}

export function getAssessmentTier(percent: number): AssessmentTier {
  if (percent >= 80) return "strong";
  if (percent >= 60) return "good";
  return "practice";
}

export function getTierLabel(tier: AssessmentTier): string {
  switch (tier) {
    case "strong":
      return "Strong match";
    case "good":
      return "Good fit";
    default:
      return "Keep practicing";
  }
}

export function getTierDescription(tier: AssessmentTier): string {
  switch (tier) {
    case "strong":
      return "Your score boosts your application visibility with employers.";
    case "good":
      return "Solid result — completing a retake above 80% can further boost your profile.";
    default:
      return "Review the role requirements and retake the exam to strengthen your application.";
  }
}

export function getBoostLabel(tier: AssessmentTier): string | null {
  if (tier === "strong") return "Hire boost +25%";
  if (tier === "good") return "Hire boost +10%";
  return null;
}
