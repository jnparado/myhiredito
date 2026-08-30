import type { JobApplication } from "./jobApplications";
import { EMPLOYER_DEMO_EMAIL } from "./employerDemoAuth";
import {
  addApplicantFromApplication,
  getApplicants,
} from "./employerApplicants";
import {
  createEmployerConversationFromApplicant,
  sendEmployerMessage,
} from "./employerMessages";
import {
  getEmployerJobsLocal,
  updateJobApplicantCount,
} from "./employerJobs";
import type { Job } from "./jobs";
import { getOrCreateEmployerConversation } from "./messages";
import { addHiredWorkerToRoster, getTrackerKeyForWorker } from "./employerWorkers";

type SyncApplicationInput = {
  workerUserKey: string;
  workerName: string;
  workerEmail: string;
  workerSkills?: string;
  workerLocation?: string;
  application: JobApplication;
  job: Job;
};

export function syncApplicationToEmployerPipeline({
  workerUserKey,
  workerName,
  workerEmail,
  workerSkills = "",
  workerLocation = "",
  application,
  job,
}: SyncApplicationInput): void {
  if (typeof window === "undefined") return;

  const employerUserKey = job.employerUserKey ?? EMPLOYER_DEMO_EMAIL;
  const employerJobs = getEmployerJobsLocal(employerUserKey);
  const matchedJob =
    employerJobs.find((item) => item.id === job.employerJobId) ??
    employerJobs.find((item) => item.slug === job.slug) ??
    employerJobs[0];

  const applicant = addApplicantFromApplication(employerUserKey, {
    jobId: matchedJob?.id ?? job.employerJobId ?? `job-${job.slug}`,
    jobSlug: job.slug,
    jobTitle: job.title,
    workerName,
    workerEmail,
    workerUserKey,
    skills: workerSkills || job.skills.join(" · "),
    experience: application.assessment
      ? `${application.assessment.percent}% exam score`
      : "Applied via MyHiredito",
    examScore: application.assessment?.percent,
    status: "new",
    appliedAt: application.appliedAt,
    location: workerLocation || job.location,
  });

  if (matchedJob) {
    const count = getApplicants(employerUserKey).filter(
      (item) => item.jobId === matchedJob.id && item.status !== "rejected",
    ).length;
    updateJobApplicantCount(employerUserKey, matchedJob.id, count);
  }

  const conversationId = createEmployerConversationFromApplicant(employerUserKey, {
    id: applicant.id,
    workerName,
    jobTitle: job.title,
    skills: applicant.skills,
  });

  const scoreText = application.assessment
    ? ` Role exam: ${application.assessment.percent}% (${application.assessment.tier}).`
    : "";

  sendEmployerMessage(
    employerUserKey,
    conversationId,
    `${workerName} applied for ${job.title}.${scoreText} Review their profile in Applicants.`,
    "MyHiredito",
  );

  getOrCreateEmployerConversation(workerUserKey, job.company, job.title);
}

export function applyEmployerDecisionToWorker({
  applicant,
  status,
  employerUserKey,
}: {
  applicant: {
    jobSlug: string;
    jobTitle: string;
    workerName: string;
    workerEmail: string;
    workerUserKey?: string;
    skills: string;
    location: string;
  };
  status: "new" | "reviewing" | "interview" | "hired" | "rejected";
  employerUserKey: string;
}): void {
  if (typeof window === "undefined") return;

  const workerStatus =
    status === "reviewing"
      ? "under-review"
      : status === "interview"
        ? "interview"
        : status === "hired"
          ? "hired"
          : status === "rejected"
            ? "rejected"
            : "submitted";

  const applicationKeys = [
    applicant.workerUserKey,
    applicant.workerEmail,
    applicant.workerName.trim().toLowerCase() === "alex rivera"
      ? "worker@demo.com"
      : "",
    applicant.workerEmail.trim().toLowerCase() === "alex.rivera@email.com"
      ? "worker@demo.com"
      : "",
  ].filter((key, index, list): key is string => !!key && list.indexOf(key) === index);

  for (const key of applicationKeys) {
    const storageKey = `myhiredito_applications_${key}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) continue;
    try {
      const existing = JSON.parse(raw) as JobApplication[];
      if (!existing.some((item) => item.jobSlug === applicant.jobSlug)) continue;
      const next = existing.map((item) =>
        item.jobSlug === applicant.jobSlug ? { ...item, status: workerStatus } : item,
      );
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("myhiredito-job-applications"));
    } catch {
      // Ignore malformed application storage.
    }
  }

  if (status === "hired") {
    addHiredWorkerToRoster(employerUserKey, {
      name: applicant.workerName,
      role: applicant.jobTitle,
      skills: applicant.skills,
      location: applicant.location,
      rating: 4.8,
      workerUserKey: getTrackerKeyForWorker({
        name: applicant.workerName,
        workerUserKey: applicant.workerUserKey,
        workerEmail: applicant.workerEmail,
      }),
      workerEmail: applicant.workerEmail,
    });
  }
}
