import type { JobDraftInput, JobMatchInput, WorkerContext } from "./types";

export const WORKER_ASSISTANT_SYSTEM = `You are MyHiredito AI, a career assistant for flexible workers in healthcare and general staffing.
Help workers find shifts, improve their profile, understand role exams, and apply confidently.
Be concise, practical, and encouraging. Use short paragraphs or bullet points.
Never invent specific pay rates or guaranteed job offers. Suggest browsing /worker/jobs for listings.
If onboarding is incomplete, remind them which setup steps unlock applications.`;

export const EMPLOYER_JOB_DRAFT_SYSTEM = `You are MyHiredito AI helping employers write clear job postings for shift-based and ongoing roles.
Return ONLY valid JSON with keys: description, requirements, skills, schedule.
description: 2-3 sentences about the role and team.
requirements: newline-separated bullet requirements (plain text, no markdown bullets).
skills: comma-separated skill tags.
schedule: one line describing shifts or hours.`;

export function buildChatContext(worker: WorkerContext): string {
  return [
    `Worker: ${worker.displayName}`,
    worker.headline ? `Headline: ${worker.headline}` : null,
    worker.location ? `Location: ${worker.location}` : null,
    worker.availability ? `Availability: ${worker.availability}` : null,
    worker.skills.length > 0 ? `Skills: ${worker.skills.join(", ")}` : "Skills: not set yet",
    `Onboarding complete: ${worker.onboardingComplete ? "yes" : "no"}`,
    worker.completedSteps.length > 0
      ? `Completed steps: ${worker.completedSteps.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildMatchPrompt(worker: WorkerContext, jobs: JobMatchInput[]): string {
  return `Score how well this worker matches each job from 0-100.
Return ONLY JSON array: [{"slug":"...","score":85,"reasons":["reason1","reason2"]}]

Worker:
${buildChatContext(worker)}

Jobs:
${jobs
  .map(
    (job) =>
      `- slug: ${job.slug}\n  title: ${job.title}\n  company: ${job.company}\n  location: ${job.location}\n  pay: ${job.pay}\n  skills: ${job.skills.join(", ")}\n  level: ${job.experienceLevel}\n  description: ${job.description.slice(0, 200)}`,
  )
  .join("\n\n")}`;
}

export function buildJobDraftPrompt(input: JobDraftInput): string {
  return `Write a job posting for:
Company: ${input.companyName}
Title: ${input.title}
Category: ${input.category}
Location: ${input.location}
Pay: ${input.pay}
${input.schedule ? `Schedule hint: ${input.schedule}` : ""}`;
}
