export type ConnectSpecialty =
  | "All"
  | "Healthcare"
  | "Admin Support"
  | "Customer Service"
  | "Web & Mobile"
  | "Sales & Marketing";

export type ExamTier = "strong" | "moderate" | "none";

export type WorkerPeer = {
  id: string;
  name: string;
  headline: string;
  location: string;
  specialty: ConnectSpecialty;
  bio: string;
  applications: number;
  examTier: ExamTier;
  examScore: number | null;
  verified: boolean;
  lastActive: string;
  seeking: string[];
  sharedEmployers: string[];
};

export type EmployerContact = {
  id: string;
  name: string;
  industry: string;
  location: string;
  openRoles: number;
  hiresOnPlatform: number;
  responseRate: number;
  specialties: ConnectSpecialty[];
  about: string;
  lastPosted: string;
};

export const connectSpecialties: ConnectSpecialty[] = [
  "All",
  "Healthcare",
  "Admin Support",
  "Customer Service",
  "Web & Mobile",
  "Sales & Marketing",
];

export const workerPeers: WorkerPeer[] = [
  {
    id: "peer-1",
    name: "CaDesha Davis",
    headline: "Certified Nursing Assistant",
    location: "Austin, TX",
    specialty: "Healthcare",
    bio: "Compassionate CNA with 4 years in assisted living. Strong patient rapport and reliable attendance.",
    applications: 6,
    examTier: "strong",
    examScore: 92,
    verified: true,
    lastActive: "2h ago",
    seeking: ["Full-time", "Day shifts", "Healthcare"],
    sharedEmployers: ["Sunrise Senior Care"],
  },
  {
    id: "peer-2",
    name: "Marcus Chen",
    headline: "Medical Billing Specialist",
    location: "Remote",
    specialty: "Admin Support",
    bio: "Detail-oriented biller familiar with ICD-10 and payer portals. Looking to join a growing clinic team.",
    applications: 3,
    examTier: "moderate",
    examScore: 68,
    verified: true,
    lastActive: "1d ago",
    seeking: ["Remote", "Contract", "Healthcare admin"],
    sharedEmployers: [],
  },
  {
    id: "peer-3",
    name: "Priya Nair",
    headline: "Registered Nurse — ICU",
    location: "Dallas, TX",
    specialty: "Healthcare",
    bio: "ICU RN with ACLS and ventilator experience. Open to rotating 12-hour schedules at metro hospitals.",
    applications: 4,
    examTier: "strong",
    examScore: 88,
    verified: true,
    lastActive: "5h ago",
    seeking: ["Full-time", "Hospital", "Critical care"],
    sharedEmployers: ["Metro General Hospital"],
  },
  {
    id: "peer-4",
    name: "Jordan Blake",
    headline: "React Native Developer",
    location: "Remote",
    specialty: "Web & Mobile",
    bio: "Mobile engineer shipping cross-platform apps. Interested in contract-to-hire product teams.",
    applications: 2,
    examTier: "moderate",
    examScore: 72,
    verified: false,
    lastActive: "3d ago",
    seeking: ["Remote", "Contract", "Startup"],
    sharedEmployers: [],
  },
  {
    id: "peer-5",
    name: "Elena Ruiz",
    headline: "Home Health Aide",
    location: "Houston, TX",
    specialty: "Healthcare",
    bio: "Experienced HHA supporting seniors at home. Bilingual English/Spanish, reliable transportation.",
    applications: 5,
    examTier: "none",
    examScore: null,
    verified: true,
    lastActive: "8h ago",
    seeking: ["Part-time", "Home health", "Weekday"],
    sharedEmployers: ["ComfortCare at Home"],
  },
  {
    id: "peer-6",
    name: "Tyler Brooks",
    headline: "Customer Support Lead",
    location: "San Antonio, TX",
    specialty: "Customer Service",
    bio: "Support lead with CRM and escalation experience. Calm under pressure and strong written communication.",
    applications: 1,
    examTier: "strong",
    examScore: 85,
    verified: true,
    lastActive: "12h ago",
    seeking: ["Full-time", "Hybrid", "SaaS"],
    sharedEmployers: [],
  },
];

export const employerContacts: EmployerContact[] = [
  {
    id: "emp-1",
    name: "Sunrise Senior Care",
    industry: "Assisted living",
    location: "Austin, TX",
    openRoles: 3,
    hiresOnPlatform: 24,
    responseRate: 94,
    specialties: ["Healthcare"],
    about: "Family-owned senior care community hiring CNAs and support staff for day and evening coverage.",
    lastPosted: "2026-07-08",
  },
  {
    id: "emp-2",
    name: "Metro General Hospital",
    industry: "Hospital & health system",
    location: "Dallas, TX",
    openRoles: 5,
    hiresOnPlatform: 41,
    responseRate: 88,
    specialties: ["Healthcare"],
    about: "Metro hospital network with ICU, ER, and med-surg openings. Role exams recommended before applying.",
    lastPosted: "2026-07-07",
  },
  {
    id: "emp-3",
    name: "ComfortCare at Home",
    industry: "Home health",
    location: "Houston, TX",
    openRoles: 2,
    hiresOnPlatform: 15,
    responseRate: 91,
    specialties: ["Healthcare"],
    about: "In-home care agency matching HHAs with clients across greater Houston.",
    lastPosted: "2026-07-05",
  },
  {
    id: "emp-4",
    name: "LaunchPad Studios",
    industry: "Technology",
    location: "Remote",
    openRoles: 1,
    hiresOnPlatform: 8,
    responseRate: 76,
    specialties: ["Web & Mobile"],
    about: "Product studio building mobile apps. Contract and temp-to-perm engineering roles.",
    lastPosted: "2026-07-03",
  },
  {
    id: "emp-5",
    name: "HealthFirst Billing Co.",
    industry: "Healthcare administration",
    location: "Remote",
    openRoles: 2,
    hiresOnPlatform: 11,
    responseRate: 82,
    specialties: ["Admin Support", "Healthcare"],
    about: "Revenue cycle team supporting clinics nationwide. Remote billing and coding specialists.",
    lastPosted: "2026-07-01",
  },
];

const PINNED_KEY = "myhiredito-connect-pinned";

export function getPinnedPeerIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function togglePinnedPeer(id: string): string[] {
  const current = getPinnedPeerIds();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  localStorage.setItem(PINNED_KEY, JSON.stringify(next));
  return next;
}

export function getExamTierLabel(tier: ExamTier): string {
  switch (tier) {
    case "strong":
      return "Strong exam";
    case "moderate":
      return "Moderate exam";
    default:
      return "No exam yet";
  }
}
