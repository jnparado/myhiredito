import type {
  AiChatMessage,
  JobDraftInput,
  JobDraftResult,
  JobMatchInput,
  JobMatchResult,
  WorkerContext,
} from "./types";

function scoreLabel(score: number): JobMatchResult["label"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Good";
  return "Fair";
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function heuristicJobMatches(
  worker: WorkerContext,
  jobs: JobMatchInput[],
): JobMatchResult[] {
  const workerSkills = new Set(
    worker.skills.map((s) => normalizeToken(s)).filter(Boolean),
  );

  return jobs.map((job) => {
    const reasons: string[] = [];
    let score = 45;

    const jobSkillTokens = job.skills.map((s) => normalizeToken(s));
    const overlap = jobSkillTokens.filter(
      (skill) =>
        workerSkills.has(skill) ||
        [...workerSkills].some(
          (ws) => ws.includes(skill) || skill.includes(ws),
        ),
    );

    if (overlap.length > 0) {
      score += overlap.length * 12;
      reasons.push(`Skills overlap: ${overlap.slice(0, 3).join(", ")}`);
    }

    if (worker.location && job.location) {
      const workerLoc = normalizeToken(worker.location);
      const jobLoc = normalizeToken(job.location);
      if (workerLoc && jobLoc.includes(workerLoc.split(" ")[0])) {
        score += 15;
        reasons.push("Location is in your area");
      }
    }

    if (worker.onboardingComplete) {
      score += 10;
      reasons.push("Profile verified — ready to apply");
    } else {
      reasons.push("Complete onboarding to unlock quick apply");
    }

    if (worker.availability?.includes("weekend") && job.description.toLowerCase().includes("weekend")) {
      score += 8;
      reasons.push("Weekend availability may fit this role");
    }

    score = Math.min(98, Math.max(35, score));

    if (reasons.length === 0) {
      reasons.push("Explore this role to see if it fits your goals");
    }

    return {
      slug: job.slug,
      score,
      label: scoreLabel(score),
      reasons: reasons.slice(0, 3),
      source: "heuristic",
    };
  });
}

export function fallbackChatReply(
  worker: WorkerContext,
  messages: AiChatMessage[],
): string {
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? "";

  if (last.includes("onboard") || last.includes("profile") || last.includes("verify")) {
    if (worker.onboardingComplete) {
      return "Your profile is verified. Take a role exam before applying — scores of 80%+ give your application a strong boost. Browse open roles at /worker/jobs.";
    }
    const pending = ["profile", "skills-certificates", "payment-method"].filter(
      (step) => !worker.completedSteps.includes(step),
    );
    return `Finish onboarding to unlock applications. Remaining steps: ${pending.join(", ")}. Start from your dashboard task list — it only takes a few minutes.`;
  }

  if (last.includes("pay") || last.includes("salary") || last.includes("money")) {
    return "Pay varies by role and shift. Filter jobs by category on /worker/jobs and look for verified payment badges. Per-diem and weekend shifts often pay more — share your availability on your home feed to get noticed.";
  }

  if (last.includes("exam") || last.includes("assessment") || last.includes("boost")) {
    return "Role exams are short quizzes tied to each job. Aim for 80%+ for a strong application boost, 60%+ for a moderate boost. You can retake before applying — your best score is shown to employers.";
  }

  if (last.includes("apply") || last.includes("job") || last.includes("shift")) {
    return `I can help you find a fit. ${worker.skills.length > 0 ? `Based on your skills (${worker.skills.slice(0, 3).join(", ")}), check the AI match badges on job cards.` : "Add skills in onboarding step 2 for better AI job matches."} Sort by "Best matches" on the jobs page.`;
  }

  return "I'm your MyHiredito career assistant. Ask me about job matches, onboarding, role exams, pay, or how to stand out to employers. What would you like help with today?";
}

export function templateJobDraft(input: JobDraftInput): JobDraftResult {
  return {
    description: `${input.companyName} is hiring a ${input.title} in ${input.location}. This ${input.category} role offers competitive pay at ${input.pay} with flexible scheduling for verified workers on MyHiredito.`,
    requirements: `Active certification or license for ${input.category}\nReliable attendance and professional communication\nAbility to work in a fast-paced team environment\nComfortable with shift-based scheduling`,
    skills: `${input.category}, Teamwork, Reliability, Customer service`,
    schedule: input.schedule ?? "Flexible shifts · Days, evenings, and weekends available",
    source: "template",
  };
}
