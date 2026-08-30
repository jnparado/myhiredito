import type { ExperienceLevel, Job, JobType, PayType } from "./jobs";

export type JobSource =
  | "myhiredito"
  | "linkedin"
  | "indeed"
  | "ziprecruiter"
  | "glassdoor"
  | "company";

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  myhiredito: "MyHiredito",
  linkedin: "LinkedIn",
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
    category: "Certified Nursing Assistant (CNA)",
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
    category: "Registered Nurse (RN)",
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
    category: "Home Health Aide",
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
    category: "Licensed Practical Nurse (LPN)",
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
];

export function detectJobSource(url: string): JobSource {
  const host = safeHost(url);
  if (host.includes("linkedin.com")) return "linkedin";
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
    category: listing.category.includes("Nurse") || listing.category.includes("CNA") || listing.category.includes("Health")
      ? "Healthcare"
      : "Admin Support",
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

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}
