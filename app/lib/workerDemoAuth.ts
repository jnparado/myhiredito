export const WORKER_DEMO_EMAIL = "worker@demo.com";
export const WORKER_DEMO_PASSWORD = "demo123";

export type WorkerDemoUser = {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
};

export const WORKER_DEMO_USER: WorkerDemoUser = {
  email: WORKER_DEMO_EMAIL,
  firstName: "Alex",
  lastName: "Rivera",
  displayName: "Alex Rivera",
};

const STORAGE_KEY = "myhiredito_worker_demo_session";

export function isDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === WORKER_DEMO_EMAIL &&
    password === WORKER_DEMO_PASSWORD
  );
}

export function setDemoWorkerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(WORKER_DEMO_USER));
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
}

export function clearDemoWorkerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("myhiredito-worker-auth"));
}

export function getDemoWorkerSession(): WorkerDemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WorkerDemoUser;
  } catch {
    return null;
  }
}
