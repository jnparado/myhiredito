import { DynamicJobDetail } from "../../../components/DynamicJobDetail";
import { JobDetailView } from "../../../components/JobDetailView";
import { getJobDetailMeta } from "../../../lib/jobDetails";
import { getJobBySlug, jobs } from "../../../lib/jobs";

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
  const job = getJobBySlug(slug);
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
  const job = getJobBySlug(slug);
  if (!job) {
    return (
      <main className="flex flex-1 flex-col">
        <DynamicJobDetail slug={slug} />
      </main>
    );
  }

  const meta = getJobDetailMeta(job);

  return (
    <main className="flex flex-1 flex-col">
      <JobDetailView job={job} meta={meta} />
    </main>
  );
}
