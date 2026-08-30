import { DynamicJobDetail } from "../../../components/DynamicJobDetail";
import { JobDetailView } from "../../../components/JobDetailView";
import { JobsPageShell } from "../../../components/worker/JobsPageShell";
import { getJobDetailMeta } from "../../../lib/jobDetails";
import { jobs } from "../../../lib/jobs";
import { resolveJobBySlug } from "../../../lib/jobCatalog";

export const dynamicParams = true;

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
  if (!job) return { title: "Job Not Found | MyHiredito" };
  return {
    title: `${job.title} | MyHiredito`,
    description: job.description,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = resolveJobBySlug(slug);

  return (
    <JobsPageShell>
      {job ? (
        <JobDetailView job={job} meta={getJobDetailMeta(job)} />
      ) : (
        <DynamicJobDetail slug={slug} />
      )}
    </JobsPageShell>
  );
}
