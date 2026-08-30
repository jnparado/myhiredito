import { ensureDemoWorkerApplications } from "./jobApplications";
import { ensureDemoConversations } from "./messages";
import { createWorkerPost, getWorkerActivity } from "./workerActivity";
import {
  WORKER_DEMO_BIO,
  WORKER_DEMO_EMAIL,
  WORKER_DEMO_ONBOARDING,
  WORKER_DEMO_PAYOUT,
} from "./workerDemoAuth";
import { ensureWorkerShifts } from "./workerShifts";

const ONBOARDING_PREFIX = "myhiredito_worker_onboarding_";
const PAYOUT_PREFIX = "myhiredito_worker_payout_";

const COMPLETE_STEPS = [...WORKER_DEMO_ONBOARDING.completedSteps];

function hasCompleteOnboarding(userKey: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(`${ONBOARDING_PREFIX}${userKey}`);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as { completedSteps?: string[] };
    const steps = parsed.completedSteps ?? [];
    return COMPLETE_STEPS.every((step) => steps.includes(step));
  } catch {
    return false;
  }
}

function writeCompleteOnboarding(userKey: string): void {
  if (typeof window === "undefined" || hasCompleteOnboarding(userKey)) return;
  localStorage.setItem(
    `${ONBOARDING_PREFIX}${userKey}`,
    JSON.stringify({
      completedSteps: COMPLETE_STEPS,
      dismissed: WORKER_DEMO_ONBOARDING.dismissed,
    }),
  );
}

function writePayout(userKey: string): void {
  if (typeof window === "undefined") return;
  const key = `${PAYOUT_PREFIX}${userKey}`;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, JSON.stringify(WORKER_DEMO_PAYOUT));
}

function writeFeedAndResume(userKey: string): void {
  if (getWorkerActivity(userKey).length > 0) return;
  createWorkerPost(
    userKey,
    "resume",
    WORKER_DEMO_BIO,
  );
  createWorkerPost(
    userKey,
    "availability",
    "Open for evening CNA shifts this week in Austin. Flexible / per diem preferred.",
  );
}

export function hydrateDemoWorkerClientState(userKey: string): void {
  if (typeof window === "undefined" || !userKey) return;

  const keys = [...new Set([userKey, WORKER_DEMO_EMAIL])];
  for (const key of keys) {
    writeCompleteOnboarding(key);
    writePayout(key);
    ensureDemoWorkerApplications(key);
    ensureDemoConversations(key);
    ensureWorkerShifts(key);
    writeFeedAndResume(key);
  }
}
