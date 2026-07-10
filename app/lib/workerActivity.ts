export type WorkerActivityType = "availability" | "credential" | "win";

export type WorkerActivity = {
  id: string;
  type: WorkerActivityType;
  body: string;
  postedAt: string;
};

const STORAGE_PREFIX = "myhiredito_worker_activity_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-worker-activity"));
}

export function getWorkerActivity(userKey: string): WorkerActivity[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as WorkerActivity[]).sort(
      (a, b) =>
        new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
  } catch {
    return [];
  }
}

function saveActivity(userKey: string, items: WorkerActivity[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(items));
  dispatchChange();
}

export function createWorkerPost(
  userKey: string,
  type: WorkerActivityType,
  body: string,
): WorkerActivity {
  const item: WorkerActivity = {
    id: `${type}-${Date.now()}`,
    type,
    body: body.trim(),
    postedAt: new Date().toISOString(),
  };
  saveActivity(userKey, [item, ...getWorkerActivity(userKey)]);
  return item;
}
