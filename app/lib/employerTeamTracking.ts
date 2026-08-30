import { EMPLOYER_DEMO_EMAIL } from "./employerDemoAuth";
import { getApplicants } from "./employerApplicants";
import {
  getEmployerWorkers,
  getTrackerKeyForWorker,
  type EmployerWorker,
} from "./employerWorkers";
import { WORKER_DEMO_EMAIL, WORKER_DEMO_USER } from "./workerDemoAuth";
import {
  getTimesheetFromShifts,
  getTrackedMsFromShifts,
  getWorkerShifts,
  listStoredShiftUserKeys,
  localDateStamp,
  type WorkerShift,
} from "./workerShifts";

export type TeamWorkerTracking = {
  worker: EmployerWorker;
  trackerKey: string;
  shifts: WorkerShift[];
  activeShift: WorkerShift | null;
  nextShift: WorkerShift | null;
  todayMs: number;
  weekMs: number;
  timesheet: WorkerShift[];
};

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function demoTeamWorker(): EmployerWorker {
  return {
    id: "demo-alex-rivera",
    name: WORKER_DEMO_USER.displayName,
    role: "CNA",
    skills: WORKER_DEMO_USER.skills.join(" · "),
    location: WORKER_DEMO_USER.location,
    rating: 4.9,
    status: "hired",
    addedAt: new Date().toISOString(),
    workerUserKey: WORKER_DEMO_EMAIL,
    workerEmail: WORKER_DEMO_EMAIL,
  };
}

export function resolveWorkerTrackerKey(worker: {
  name: string;
  workerUserKey?: string;
  workerEmail?: string;
}): string {
  const storedKeys = listStoredShiftUserKeys();
  const mapped = getTrackerKeyForWorker(worker);
  const candidates = [
    worker.workerUserKey,
    worker.workerEmail,
    mapped,
  ].filter((value): value is string => !!value?.trim());

  for (const candidate of candidates) {
    const match = storedKeys.find(
      (key) => key === candidate || key.toLowerCase() === candidate.toLowerCase(),
    );
    if (match) return match;
  }

  if (mapped) return mapped;
  return worker.workerUserKey || worker.workerEmail || "";
}

function isSameWorker(a: EmployerWorker, b: EmployerWorker): boolean {
  const aKey = normalize(resolveWorkerTrackerKey(a));
  const bKey = normalize(resolveWorkerTrackerKey(b));
  if (aKey && bKey && aKey === bKey) return true;
  return normalize(a.name) === normalize(b.name);
}

export function getTeamWorkers(employerUserKey: string): EmployerWorker[] {
  const roster = getEmployerWorkers(employerUserKey).filter(
    (worker) => worker.status === "hired" || worker.status === "active",
  );

  const hiredApplicants = getApplicants(employerUserKey)
    .filter((applicant) => applicant.status === "hired")
    .map(
      (applicant): EmployerWorker => ({
        id: applicant.id,
        name: applicant.workerName,
        role: applicant.jobTitle,
        skills: applicant.skills,
        location: applicant.location,
        rating: 4.8,
        status: "hired",
        addedAt: applicant.appliedAt,
        workerUserKey: applicant.workerUserKey,
        workerEmail: applicant.workerEmail,
      }),
    );

  const combined: EmployerWorker[] = [];
  for (const worker of [...roster, ...hiredApplicants]) {
    if (combined.some((item) => isSameWorker(item, worker))) continue;
    combined.push({
      ...worker,
      workerUserKey: resolveWorkerTrackerKey(worker) || worker.workerUserKey,
    });
  }

  if (employerUserKey === EMPLOYER_DEMO_EMAIL) {
    const alex = demoTeamWorker();
    if (!combined.some((item) => isSameWorker(item, alex))) {
      combined.unshift(alex);
    }
  }

  return combined;
}

export function getTeamTrackingSnapshots(
  employerUserKey: string,
  now = Date.now(),
): TeamWorkerTracking[] {
  const todayStamp = localDateStamp();

  return getTeamWorkers(employerUserKey).map((worker) => {
    const trackerKey = resolveWorkerTrackerKey(worker);
    const shifts = trackerKey ? getWorkerShifts(trackerKey) : [];
    const activeShift =
      shifts.find((shift) => shift.status === "clocked-in") ?? null;
    const nextShift =
      shifts.find(
        (shift) =>
          ["scheduled", "confirmed", "en-route"].includes(shift.status) &&
          shift.shiftDate >= todayStamp,
      ) ?? null;

    return {
      worker,
      trackerKey,
      shifts,
      activeShift,
      nextShift,
      todayMs: getTrackedMsFromShifts(shifts, now, "today"),
      weekMs: getTrackedMsFromShifts(shifts, now, "week"),
      timesheet: getTimesheetFromShifts(shifts),
    };
  });
}
