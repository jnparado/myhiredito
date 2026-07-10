import { notFound } from "next/navigation";
import { RoleAssessment } from "../../../../components/worker/RoleAssessment";
import { JobsPageShell } from "../../../../components/worker/JobsPageShell";
import { getJobBySlug, jobs } from "../../../../lib/jobs";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Assessment Not Found | MyHiredito" };
  return {
    title: `Role Exam — ${job.title} | MyHiredito`,
    description: `Quick role assessment for ${job.title} to boost your hire chances.`,
  };
}

export default async function JobAssessmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  return (
    <JobsPageShell>
      <RoleAssessment job={job} />
    </JobsPageShell>
  );
}
