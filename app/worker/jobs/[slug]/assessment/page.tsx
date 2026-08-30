import { RoleAssessment } from "../../../../components/worker/RoleAssessment";
import { DynamicRoleAssessment } from "../../../../components/worker/DynamicRoleAssessment";
import { JobsPageShell } from "../../../../components/worker/JobsPageShell";
import { jobs } from "../../../../lib/jobs";
import { resolveJobBySlug } from "../../../../lib/jobCatalog";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = resolveJobBySlug(slug);
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
  const job = resolveJobBySlug(slug);

  return (
    <JobsPageShell>
      {job ? <RoleAssessment job={job} /> : <DynamicRoleAssessment slug={slug} />}
    </JobsPageShell>
  );
}
