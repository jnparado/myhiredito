import type { ExperienceLevel, Job, JobType, PayType } from "./jobs";

export type JobSource =
  | "myhiredito"
  | "linkedin"
  | "upwork"
  | "indeed"
  | "ziprecruiter"
  | "glassdoor"
  | "company";

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  myhiredito: "MyHiredito",
  linkedin: "LinkedIn",
  upwork: "Upwork",
  indeed: "Indeed",
  ziprecruiter: "ZipRecruiter",
  glassdoor: "Glassdoor",
  company: "Company site",
};

export type ExternalHiringListing = {
  id: string;
  source: Exclude<JobSource, "myhiredito">;
  sourceUrl: string;
  title: string;
  company: string;
  category: string;
  location: string;
  pay: string;
  payType: PayType;
  jobType: JobType;
  schedule: string;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string;
  skills: string[];
  postedAt: string;
};

export const EXTERNAL_HIRING_BOARD: ExternalHiringListing[] = [
  {
    id: "ext-li-cna-nights",
    source: "linkedin",
    sourceUrl: "https://www.linkedin.com/jobs/view/cna-night-shift-austin",
    title: "Certified Nursing Assistant — Night Shift",
    company: "Austin Elder Care Partners",
    category: "Healthcare",
    location: "Austin, TX",
    pay: "$24–$28/hr",
    payType: "hourly",
    jobType: "on-demand",
    schedule: "10pm – 6am · 3–4 nights/week",
    experienceLevel: "intermediate",
    description:
      "LinkedIn hiring post: night-shift CNAs needed for a 120-bed skilled nursing facility. Immediate starts for verified credentials.",
    requirements: "Active CNA license\nBLS/CPR\nNight availability",
    skills: ["CNA", "Patient Care", "CPR"],
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-indeed-rn-icu",
    source: "indeed",
    sourceUrl: "https://www.indeed.com/viewjob?jk=rn-icu-dallas",
    title: "Registered Nurse — ICU",
    company: "Metro General Hospital",
    category: "Healthcare",
    location: "Dallas, TX",
    pay: "$42–$48/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "12-hour days · rotating weekends",
    experienceLevel: "expert",
    description:
      "Indeed listing: ICU RNs for weekend and weekday coverage. ACLS required. Interviews this week.",
    requirements: "RN license (TX)\nACLS\n1+ year ICU",
    skills: ["RN", "ICU", "ACLS"],
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-zip-hha",
    source: "ziprecruiter",
    sourceUrl: "https://www.ziprecruiter.com/jobs/home-health-aide-round-rock",
    title: "Home Health Aide",
    company: "Comfort Home Care",
    category: "Healthcare",
    location: "Round Rock, TX",
    pay: "$20–$23/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Day shifts · flexible caseload",
    experienceLevel: "entry",
    description:
      "ZipRecruiter hiring: HHAs for in-home visits. Reliable transportation required. Weekly pay.",
    requirements: "HHA or CNA preferred\nValid driver's license",
    skills: ["HHA", "Home Care", "Companionship"],
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-glassdoor-lpn",
    source: "glassdoor",
    sourceUrl: "https://www.glassdoor.com/job-listing/lpn-clinic-houston",
    title: "Licensed Practical Nurse — Clinic",
    company: "Gulf Coast Family Clinic",
    category: "Healthcare",
    location: "Houston, TX",
    pay: "$28–$32/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Mon–Fri clinic hours",
    experienceLevel: "intermediate",
    description:
      "Glassdoor listing: outpatient LPN for a growing family clinic. Benefits after 90 days.",
    requirements: "Active LPN license\nClinic or med-surg experience",
    skills: ["LPN", "Clinic", "Vitals"],
    postedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-li-react-native",
    source: "linkedin",
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=React%20Native%20Developer",
    title: "React Native Developer",
    company: "Northstar Mobile",
    category: "Web & Mobile",
    location: "Remote",
    pay: "$50–$70/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Full-time contract · US hours",
    experienceLevel: "expert",
    description:
      "LinkedIn Jobs: ship iOS and Android features for a consumer fitness app. TypeScript, CI/CD, and App Store releases required.",
    requirements: "3+ years React Native\nTypeScript\nPublished apps",
    skills: ["React Native", "TypeScript", "iOS", "Android"],
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-up-react-native",
    source: "upwork",
    sourceUrl: "https://www.upwork.com/nx/search/jobs/?q=React%20Native",
    title: "React Native Developer for Mobile App",
    company: "LaunchPad Studios",
    category: "Web & Mobile",
    location: "Remote",
    pay: "$45–$65/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Hourly · 30+ hrs/week",
    experienceLevel: "expert",
    description:
      "Upwork contract: own feature development and performance work on a React Native fitness app. Weekly payouts.",
    requirements: "React Native\nTypeScript\nREST APIs",
    skills: ["React Native", "TypeScript", "REST APIs"],
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-li-nextjs",
    source: "linkedin",
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=Next.js%20Supabase",
    title: "Full-Stack Developer (Next.js + Supabase)",
    company: "Harborline Software",
    category: "Web & Mobile",
    location: "Remote",
    pay: "$60–$85/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Contract-to-hire",
    experienceLevel: "expert",
    description:
      "LinkedIn Jobs: build an authenticated dashboard with Next.js App Router and Supabase RLS.",
    requirements: "Next.js App Router\nSupabase\nTailwind CSS",
    skills: ["Next.js", "Supabase", "PostgreSQL", "Tailwind CSS"],
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-up-nextjs",
    source: "upwork",
    sourceUrl: "https://www.upwork.com/nx/search/jobs/?q=Next.js%20Supabase",
    title: "Next.js + Supabase dashboard build",
    company: "ScaleStack Inc.",
    category: "Web & Mobile",
    location: "Remote",
    pay: "$5,000 fixed",
    payType: "fixed",
    jobType: "on-demand",
    schedule: "Project-based · 4–6 weeks",
    experienceLevel: "intermediate",
    description:
      "Upwork fixed-price: deliver a production Next.js dashboard with Supabase auth and Vercel deploy.",
    requirements: "Next.js\nSupabase\nIndependent delivery",
    skills: ["Next.js", "Supabase", "Vercel"],
    postedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-li-ui-designer",
    source: "linkedin",
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=Product%20Designer%20Figma",
    title: "Product Designer — SaaS",
    company: "Brightline Labs",
    category: "Design & Creative",
    location: "Austin, TX",
    pay: "$55–$75/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Hybrid · 3 days onsite",
    experienceLevel: "intermediate",
    description:
      "LinkedIn Jobs: design systems and onboarding flows for a staffing SaaS product.",
    requirements: "Figma\nDesign systems\nSaaS experience",
    skills: ["Figma", "UI Design", "Design Systems"],
    postedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-up-ui-designer",
    source: "upwork",
    sourceUrl: "https://www.upwork.com/nx/search/jobs/?q=UI%20UX%20Designer",
    title: "UI/UX designer for hiring marketplace",
    company: "Fieldwork Digital",
    category: "Design & Creative",
    location: "Remote",
    pay: "$40–$60/hr",
    payType: "hourly",
    jobType: "on-demand",
    schedule: "Part-time · 15 hrs/week",
    experienceLevel: "intermediate",
    description:
      "Upwork: redesign job cards and apply flow. Figma files and weekly design reviews.",
    requirements: "Figma\nMobile + web\nPortfolio required",
    skills: ["Figma", "UX Research", "Prototyping"],
    postedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-up-cna",
    source: "upwork",
    sourceUrl: "https://www.upwork.com/nx/search/jobs/?q=Certified%20Nursing%20Assistant",
    title: "CNA — per diem coverage",
    company: "Summit Healthcare Staffing",
    category: "Healthcare",
    location: "Austin, TX",
    pay: "$23–$27/hr",
    payType: "hourly",
    jobType: "on-demand",
    schedule: "Per diem · same-week starts",
    experienceLevel: "intermediate",
    description:
      "Upwork staffing contract: cover CNA shifts at partner facilities. Weekly pay after verified hours.",
    requirements: "Active CNA\nCPR\nAustin-area availability",
    skills: ["CNA", "Patient Care", "CPR"],
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ext-li-copywriter",
    source: "linkedin",
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=Healthcare%20Copywriter",
    title: "Healthcare Copywriter",
    company: "Wellspring Content",
    category: "Writing",
    location: "Remote",
    pay: "$35–$50/hr",
    payType: "hourly",
    jobType: "ongoing",
    schedule: "Retainer · 10–15 hrs/week",
    experienceLevel: "intermediate",
    description:
      "LinkedIn Jobs: write patient-facing blog posts and job ads for healthcare brands.",
    requirements: "Healthcare writing samples\nSEO basics",
    skills: ["Copywriting", "SEO", "Healthcare"],
    postedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
];

export function detectJobSource(url: string): JobSource {
  const host = safeHost(url);
  if (host.includes("linkedin.com")) return "linkedin";
  if (host.includes("upwork.com")) return "upwork";
  if (host.includes("indeed.com")) return "indeed";
  if (host.includes("ziprecruiter.com")) return "ziprecruiter";
  if (host.includes("glassdoor.com")) return "glassdoor";
  if (host) return "company";
  return "myhiredito";
}

export function isSupportedJobBoardUrl(url: string): boolean {
  const host = safeHost(url);
  return [
    "linkedin.com",
    "upwork.com",
    "indeed.com",
    "ziprecruiter.com",
    "glassdoor.com",
    "monster.com",
    "simplyhired.com",
    "greenhouse.io",
    "lever.co",
  ].some((allowed) => host.includes(allowed));
}

export function titleFromJobUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const last = decodeURIComponent(
      parsed.pathname.split("/").filter(Boolean).pop() ?? "",
    )
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
    return last.replace(/\d+/g, "").trim() || "Imported role";
  } catch {
    return "Imported role";
  }
}

export function listingToJobDraft(listing: ExternalHiringListing): {
  title: string;
  category: string;
  location: string;
  pay: string;
  payType: PayType;
  jobType: JobType;
  schedule: string;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string;
  skills: string;
  source: JobSource;
  sourceUrl: string;
} {
  return {
    title: listing.title,
    category: listing.category,
    location: listing.location,
    pay: listing.pay,
    payType: listing.payType,
    jobType: listing.jobType,
    schedule: listing.schedule,
    experienceLevel: listing.experienceLevel,
    description: listing.description,
    requirements: listing.requirements,
    skills: listing.skills.join(", "),
    source: listing.source,
    sourceUrl: listing.sourceUrl,
  };
}

export function listingToMarketplaceJob(listing: ExternalHiringListing): Job {
  return {
    id: listing.id,
    slug: listing.id,
    title: listing.title,
    company: listing.company,
    category: marketplaceCategory(listing),
    location: listing.location,
    pay: listing.pay,
    payType: listing.payType,
    type: listing.jobType,
    schedule: listing.schedule,
    postedAt: listing.postedAt.slice(0, 10),
    experienceLevel: listing.experienceLevel,
    skills: listing.skills,
    proposals: 8,
    verified: true,
    description: listing.description,
    responsibilities: listing.description.split(". ").filter(Boolean).slice(0, 3),
    requirements: listing.requirements.split("\n").filter(Boolean),
    source: listing.source,
    sourceUrl: listing.sourceUrl,
  };
}

function marketplaceCategory(listing: ExternalHiringListing): string {
  const known = [
    "Healthcare",
    "Web & Mobile",
    "Design & Creative",
    "Writing",
    "Sales & Marketing",
    "Admin Support",
    "Customer Service",
    "Data & Analytics",
    "Accounting",
  ];
  if (known.includes(listing.category)) return listing.category;

  const hay = `${listing.category} ${listing.title} ${listing.skills.join(" ")}`.toLowerCase();
  if (/cna|nurse|health|aide|lpn|rn\b/.test(hay)) return "Healthcare";
  if (/react|next\.?js|developer|engineer|mobile|ios|android|supabase/.test(hay)) {
    return "Web & Mobile";
  }
  if (/design|figma|ui|ux/.test(hay)) return "Design & Creative";
  if (/writ|content|copy/.test(hay)) return "Writing";
  if (/sales|marketing|seo/.test(hay)) return "Sales & Marketing";
  if (/customer|support/.test(hay)) return "Customer Service";
  if (/data|analyst|sql/.test(hay)) return "Data & Analytics";
  if (/account|bookkeep/.test(hay)) return "Accounting";
  return "Admin Support";
}

export function isExternalMarketplaceJob(job: Job): boolean {
  return Boolean(job.source && job.source !== "myhiredito" && job.sourceUrl);
}

export function jobMatchesQuery(job: Job, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const sourceLabel = job.source ? JOB_SOURCE_LABELS[job.source].toLowerCase() : "";
  return (
    job.title.toLowerCase().includes(q) ||
    job.company.toLowerCase().includes(q) ||
    job.description.toLowerCase().includes(q) ||
    job.category.toLowerCase().includes(q) ||
    job.location.toLowerCase().includes(q) ||
    job.skills.some((skill) => skill.toLowerCase().includes(q)) ||
    sourceLabel.includes(q) ||
    (job.source ?? "").includes(q)
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}
