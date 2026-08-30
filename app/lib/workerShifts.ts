export type ShiftStatus =
  | "scheduled"
  | "confirmed"
  | "en-route"
  | "clocked-in"
  | "completed"
  | "missed";

export type WorkerShift = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  pay: string;
  status: ShiftStatus;
  clockedInAt?: string;
  clockedOutAt?: string;
  enRouteAt?: string;
};

const STORAGE_PREFIX = "myhiredito_worker_shifts_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-worker-shifts"));
}

function dateOnly(daysFromNow: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

function defaultShifts(): WorkerShift[] {
  return [
    {
      id: "shift-today-evening",
      jobTitle: "Certified Nursing Assistant (CNA)",
      company: "Sunrise Senior Care",
      location: "1200 Barton Springs Rd, Austin, TX",
      shiftDate: dateOnly(0),
      startTime: "6:00 PM",
      endTime: "10:00 PM",
      pay: "$24/hr",
      status: "confirmed",
    },
    {
      id: "shift-tomorrow-day",
      jobTitle: "Certified Nursing Assistant (CNA)",
      company: "Metro Hospital Group",
      location: "4500 Medical Pkwy, Austin, TX",
      shiftDate: dateOnly(1),
      startTime: "7:00 AM",
      endTime: "3:00 PM",
      pay: "$26/hr",
      status: "scheduled",
    },
    {
      id: "shift-weekend",
      jobTitle: "Home Health Aide",
      company: "Comfort Home Care",
      location: "Round Rock, TX",
      shiftDate: dateOnly(3),
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      pay: "$22/hr",
      status: "scheduled",
    },
    {
      id: "shift-past",
      jobTitle: "Certified Nursing Assistant (CNA)",
      company: "Sunrise Senior Care",
      location: "Austin, TX",
      shiftDate: dateOnly(-2),
      startTime: "2:00 PM",
      endTime: "10:00 PM",
      pay: "$24/hr",
      status: "completed",
      clockedInAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      clockedOutAt: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
      ).toISOString(),
    },
  ];
}

export function getWorkerShifts(userKey: string): WorkerShift[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WorkerShift[];
  } catch {
    return [];
  }
}

function saveWorkerShifts(userKey: string, shifts: WorkerShift[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(shifts));
  dispatchChange();
}

export function ensureWorkerShifts(userKey: string): WorkerShift[] {
  const existing = getWorkerShifts(userKey);
  if (existing.length > 0) return sortShifts(existing);
  const seeded = defaultShifts();
  saveWorkerShifts(userKey, seeded);
  return seeded;
}

function sortShifts(shifts: WorkerShift[]): WorkerShift[] {
  return [...shifts].sort((a, b) => {
    const dateCompare = a.shiftDate.localeCompare(b.shiftDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
}

function updateShift(
  userKey: string,
  shiftId: string,
  updater: (shift: WorkerShift) => WorkerShift,
): WorkerShift | null {
  let updated: WorkerShift | null = null;
  const next = getWorkerShifts(userKey).map((shift) => {
    if (shift.id !== shiftId) return shift;
    updated = updater(shift);
    return updated;
  });
  saveWorkerShifts(userKey, next);
  return updated;
}

export function confirmShift(userKey: string, shiftId: string): void {
  updateShift(userKey, shiftId, (shift) =>
    shift.status === "scheduled" ? { ...shift, status: "confirmed" } : shift,
  );
}

export function markShiftEnRoute(userKey: string, shiftId: string): void {
  updateShift(userKey, shiftId, (shift) =>
    shift.status === "confirmed"
      ? { ...shift, status: "en-route", enRouteAt: new Date().toISOString() }
      : shift,
  );
}

export function clockInToShift(userKey: string, shiftId: string): void {
  updateShift(userKey, shiftId, (shift) =>
    shift.status === "confirmed" || shift.status === "en-route"
      ? { ...shift, status: "clocked-in", clockedInAt: new Date().toISOString() }
      : shift,
  );
}

export function clockOutOfShift(userKey: string, shiftId: string): void {
  updateShift(userKey, shiftId, (shift) =>
    shift.status === "clocked-in"
      ? { ...shift, status: "completed", clockedOutAt: new Date().toISOString() }
      : shift,
  );
}

export function getActiveShift(userKey: string): WorkerShift | null {
  return (
    ensureWorkerShifts(userKey).find((shift) => shift.status === "clocked-in") ??
    null
  );
}

export function getNextShift(userKey: string): WorkerShift | null {
  const today = dateOnly(0);
  const upcoming = ensureWorkerShifts(userKey).filter(
    (shift) =>
      ["scheduled", "confirmed", "en-route"].includes(shift.status) &&
      shift.shiftDate >= today,
  );
  return upcoming[0] ?? null;
}

export function formatShiftDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatShiftTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getShiftDurationMs(
  shift: WorkerShift,
  now = Date.now(),
): number {
  if (!shift.clockedInAt) return 0;
  const start = new Date(shift.clockedInAt).getTime();
  const end = shift.clockedOutAt
    ? new Date(shift.clockedOutAt).getTime()
    : now;
  return Math.max(0, end - start);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDurationShort(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function isSameDay(dateA: string, dateB: string): boolean {
  return dateA === dateB;
}

function weekStartDate(): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return date.toISOString().slice(0, 10);
}

export function getTodayTrackedMs(userKey: string, now = Date.now()): number {
  const today = dateOnly(0);
  return ensureWorkerShifts(userKey)
    .filter((shift) => shift.clockedInAt)
    .filter(
      (shift) =>
        isSameDay(shift.shiftDate, today) || shift.status === "clocked-in",
    )
    .reduce((sum, shift) => sum + getShiftDurationMs(shift, now), 0);
}

export function getWeekTrackedMs(userKey: string, now = Date.now()): number {
  const weekStart = weekStartDate();
  return ensureWorkerShifts(userKey)
    .filter((shift) => shift.clockedInAt && shift.shiftDate >= weekStart)
    .reduce((sum, shift) => sum + getShiftDurationMs(shift, now), 0);
}

export function getCompletedTimesheet(userKey: string): WorkerShift[] {
  return ensureWorkerShifts(userKey)
    .filter((shift) => shift.status === "completed" && shift.clockedInAt)
    .sort((a, b) => b.shiftDate.localeCompare(a.shiftDate));
}

export const SHIFT_STATUS_LABELS: Record<ShiftStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  "en-route": "En route",
  "clocked-in": "Clocked in",
  completed: "Completed",
  missed: "Missed",
};

export const SHIFT_STATUS_COLORS: Record<ShiftStatus, string> = {
  scheduled: "bg-zinc-100 text-zinc-600",
  confirmed: "bg-blue-100 text-blue-700",
  "en-route": "bg-amber-100 text-amber-800",
  "clocked-in": "bg-[#1db954]/15 text-[#1a5c42]",
  completed: "bg-emerald-100 text-emerald-700",
  missed: "bg-red-100 text-red-700",
};
