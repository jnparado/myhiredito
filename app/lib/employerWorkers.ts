export type WorkerRosterStatus = "saved" | "invited" | "active" | "hired";

export type EmployerWorker = {
  id: string;
  name: string;
  role: string;
  skills: string;
  location: string;
  rating: number;
  status: WorkerRosterStatus;
  addedAt: string;
};

const STORAGE_PREFIX = "myhiredito_employer_workers_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-workers"));
}

const SUGGESTED_POOL: Omit<EmployerWorker, "id" | "status" | "addedAt">[] = [
  {
    name: "Maria Santos",
    role: "CNA",
    skills: "5 yrs experience · Patient Care",
    location: "Austin, TX",
    rating: 4.9,
  },
  {
    name: "James Chen",
    role: "RN",
    skills: "ICU certified · ACLS",
    location: "Austin, TX",
    rating: 4.8,
  },
  {
    name: "Aisha Patel",
    role: "LPN",
    skills: "Home health · 4.9 rating",
    location: "Round Rock, TX",
    rating: 4.9,
  },
  {
    name: "David Kim",
    role: "Warehouse Associate",
    skills: "Forklift certified · Night shifts",
    location: "Cedar Park, TX",
    rating: 4.7,
  },
];

export function getEmployerWorkers(userKey: string): EmployerWorker[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EmployerWorker[];
  } catch {
    return [];
  }
}

function saveWorkers(userKey: string, workers: EmployerWorker[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(workers));
  dispatchChange();
}

export function inviteWorker(
  userKey: string,
  worker: Omit<EmployerWorker, "id" | "status" | "addedAt">,
): EmployerWorker {
  const existing = getEmployerWorkers(userKey);
  const found = existing.find((w) => w.name === worker.name);
  if (found) {
    const updated = existing.map((w) =>
      w.name === worker.name ? { ...w, status: "invited" as const } : w,
    );
    saveWorkers(userKey, updated);
    return { ...found, status: "invited" };
  }

  const created: EmployerWorker = {
    ...worker,
    id: `worker-${Date.now()}`,
    status: "invited",
    addedAt: new Date().toISOString(),
  };
  saveWorkers(userKey, [created, ...existing]);
  return created;
}

export function saveWorkerToRoster(
  userKey: string,
  worker: Omit<EmployerWorker, "id" | "status" | "addedAt">,
): EmployerWorker {
  const existing = getEmployerWorkers(userKey);
  if (existing.some((w) => w.name === worker.name)) {
    return existing.find((w) => w.name === worker.name)!;
  }
  const created: EmployerWorker = {
    ...worker,
    id: `worker-${Date.now()}`,
    status: "saved",
    addedAt: new Date().toISOString(),
  };
  saveWorkers(userKey, [created, ...existing]);
  return created;
}

export function updateWorkerStatus(
  userKey: string,
  workerId: string,
  status: WorkerRosterStatus,
): void {
  const next = getEmployerWorkers(userKey).map((w) =>
    w.id === workerId ? { ...w, status } : w,
  );
  saveWorkers(userKey, next);
}

export function getSuggestedWorkers(userKey: string): typeof SUGGESTED_POOL {
  const roster = getEmployerWorkers(userKey);
  const rosterNames = new Set(roster.map((w) => w.name));
  return SUGGESTED_POOL.filter((w) => !rosterNames.has(w.name));
}

export function getActiveWorkerCount(userKey: string): number {
  return getEmployerWorkers(userKey).filter(
    (w) => w.status === "active" || w.status === "hired",
  ).length;
}
