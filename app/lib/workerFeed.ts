import type { EmployerActivity } from "./employerActivity";
import { formatPostedAgo } from "./employerJobs";
import { jobs, type Job } from "./jobs";
import { getPublishedJobs } from "./publishedJobs";
import type { WorkerActivity } from "./workerActivity";

export type NetworkFeedPost = {
  id: string;
  author: string;
  headline: string;
  body: string;
  hashtags: string[];
  postedAt: string;
  likes: number;
  likedBy?: string;
  job?: Job;
  connection: "1st" | "2nd" | "Hiring";
};

export type WorkerFeedItem =
  | {
      kind: "worker";
      id: string;
      activity: WorkerActivity;
      postedAt: string;
    }
  | {
      kind: "job";
      id: string;
      job: Job;
      author: string;
      headline: string;
      postedAt: string;
      likes: number;
      likedBy?: string;
    }
  | {
      kind: "shift" | "update";
      id: string;
      activity: EmployerActivity;
      companyName: string;
      postedAt: string;
    }
  | {
      kind: "network";
      id: string;
      post: NetworkFeedPost;
      postedAt: string;
    };

const NETWORK_SEED: NetworkFeedPost[] = [
  {
    id: "net-1",
    author: "Ruary Feb Suminguit",
    headline: "Talent partner · Healthcare staffing",
    body: "We're hiring Philippine-based professionals for a US healthcare client. Remote-friendly onboarding, verified credentials required, and same-week start for qualified CNAs.",
    hashtags: ["#HealthcareJobs", "#CNA", "#RemoteOnboarding", "#MyHiredito"],
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    likedBy: "Maria Santos",
    connection: "2nd",
    job: jobs.find((j) => j.slug === "certified-nursing-assistant"),
  },
  {
    id: "net-2",
    author: "Metro Hospital HR",
    headline: "Actively hiring weekend RNs & CNAs",
    body: "Weekend coverage is our biggest need right now. Workers with 80%+ role exam scores are getting interview invites within 48 hours. Drop your availability if you're open to per-diem shifts.",
    hashtags: ["#WeekendShifts", "#Nursing", "#PerDiem", "#VerifiedWorkers"],
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 41,
    connection: "Hiring",
    job: jobs.find((j) => j.slug === "registered-nurse-icu"),
  },
  {
    id: "net-3",
    author: "Sunrise Care Network",
    headline: "Building a verified per-diem bench",
    body: "Great shift yesterday — three MyHiredito pros filled our evening block with zero call-offs. If you're CNA or HHA certified in Austin, we're adding to our priority list this month.",
    hashtags: ["#AustinJobs", "#HHA", "#ShiftWork", "#Staffing"],
    postedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    likes: 18,
    likedBy: "Alex Rivera",
    connection: "2nd",
    job: jobs.find((j) => j.slug === "home-health-aide"),
  },
];

function getAllEmployerActivity(): EmployerActivity[] {
  if (typeof window === "undefined") return [];
  const items: EmployerActivity[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("myhiredito_employer_activity_")) continue;
    try {
      const parsed = JSON.parse(
        localStorage.getItem(key) ?? "[]",
      ) as EmployerActivity[];
      items.push(...parsed);
    } catch {
      // ignore malformed entries
    }
  }
  return items;
}

function mergeJobs(): Job[] {
  const published = getPublishedJobs();
  const publishedSlugs = new Set(published.map((j) => j.slug));
  const staticJobs = jobs.filter((j) => !publishedSlugs.has(j.slug));
  return [...published, ...staticJobs];
}

function jobToFeedAuthor(job: Job): { author: string; headline: string } {
  return {
    author: job.company,
    headline: `Hiring ${job.title.split("(")[0].trim()} · ${job.location}`,
  };
}

export function buildWorkerFeed(
  userKey: string | null,
  workerPosts: WorkerActivity[],
): WorkerFeedItem[] {
  const items: WorkerFeedItem[] = [];

  for (const activity of workerPosts) {
    items.push({
      kind: "worker",
      id: activity.id,
      activity,
      postedAt: activity.postedAt,
    });
  }

  for (const post of NETWORK_SEED) {
    items.push({
      kind: "network",
      id: post.id,
      post,
      postedAt: post.postedAt,
    });
  }

  for (const activity of getAllEmployerActivity()) {
    items.push({
      kind: activity.type,
      id: activity.id,
      activity,
      companyName: "Employer on MyHiredito",
      postedAt: activity.postedAt,
    });
  }

  const marketplaceJobs = mergeJobs();
  for (const job of marketplaceJobs.slice(0, 8)) {
    const { author, headline } = jobToFeedAuthor(job);
    items.push({
      kind: "job",
      id: `job-${job.id}`,
      job,
      author,
      headline,
      postedAt: new Date(job.postedAt).toISOString(),
      likes: Math.max(3, job.proposals * 2),
      likedBy: job.proposals > 5 ? "Workers in your area" : undefined,
    });
  }

  return items.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
}

export function getEmployerViewCount(applicationCount: number): number {
  return Math.max(applicationCount * 3 + 4, 9);
}

export { formatPostedAgo };
