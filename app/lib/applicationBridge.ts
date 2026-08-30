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
