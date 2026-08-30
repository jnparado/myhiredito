import { WORKER_DEMO_EMAIL } from "./workerDemoAuth";

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
  workerUserKey?: string;
  workerEmail?: string;
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
    workerUserKey: "maria.santos@email.com",
    workerEmail: "maria.santos@email.com",
  },
  {
    name: "James Chen",
    role: "RN",
    skills: "ICU certified · ACLS",
    location: "Austin, TX",
    rating: 4.8,
    workerUserKey: "james.chen@email.com",
    workerEmail: "james.chen@email.com",
  },
  {
    name: "Aisha Patel",
    role: "LPN",
    skills: "Home health · 4.9 rating",
    location: "Round Rock, TX",
    rating: 4.9,
    workerUserKey: "aisha.patel@email.com",
    workerEmail: "aisha.patel@email.com",
  },
  {
    name: "David Kim",
    role: "Warehouse Associate",
    skills: "Forklift certified · Night shifts",
    location: "Cedar Park, TX",
    rating: 4.7,
    workerUserKey: "david.kim@email.com",
    workerEmail: "david.kim@email.com",
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
      w.name === worker.name
        ? {
            ...w,
            ...worker,
            id: w.id,
            addedAt: w.addedAt,
            status: "invited" as const,
          }
        : w,
    );
    saveWorkers(userKey, updated);
    return {
      ...found,
      ...worker,
      id: found.id,
      addedAt: found.addedAt,
      status: "invited",
    };
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

export function addHiredWorkerToRoster(
  userKey: string,
  worker: Omit<EmployerWorker, "id" | "status" | "addedAt">,
): EmployerWorker {
  const existing = getEmployerWorkers(userKey);
  const found = existing.find((item) => item.name === worker.name);
  if (found) {
    const merged: EmployerWorker = {
      ...found,
      ...worker,
      id: found.id,
      status: "hired",
      addedAt: found.addedAt,
    };
    const next = existing.map((item) =>
      item.name === worker.name ? merged : item,
    );
    saveWorkers(userKey, next);
    return merged;
  }

  const created: EmployerWorker = {
    ...worker,
    id: `worker-${Date.now()}`,
    status: "hired",
    addedAt: new Date().toISOString(),
  };
  saveWorkers(userKey, [created, ...existing]);
  return created;
}

const KNOWN_WORKER_TRACKER_KEYS: Record<string, string> = {
  "alex rivera": WORKER_DEMO_EMAIL,
  "alex.rivera@email.com": WORKER_DEMO_EMAIL,
  [WORKER_DEMO_EMAIL]: WORKER_DEMO_EMAIL,
};

export function getTrackerKeyForWorker(worker: {
  name: string;
  workerUserKey?: string;
  workerEmail?: string;
}): string {
  const explicit = (worker.workerUserKey || worker.workerEmail || "").trim().toLowerCase();
  if (explicit && KNOWN_WORKER_TRACKER_KEYS[explicit]) {
    return KNOWN_WORKER_TRACKER_KEYS[explicit];
  }
  if (explicit) return worker.workerUserKey || worker.workerEmail || explicit;

  const byName = KNOWN_WORKER_TRACKER_KEYS[worker.name.trim().toLowerCase()];
  if (byName) return byName;

  return (
    worker.name.trim().toLowerCase().replace(/\s+/g, ".") + "@workers.myhiredito"
  );
}

export function getActiveWorkerCount(userKey: string): number {
  return getEmployerWorkers(userKey).filter(
    (w) => w.status === "active" || w.status === "hired",
  ).length;
}
