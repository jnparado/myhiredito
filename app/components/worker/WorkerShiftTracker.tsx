"use client";

import Link from "next/link";
import { useWorkerShifts } from "@/app/hooks/useWorkerShifts";
import {
  clockInToShift,
  clockOutOfShift,
  confirmShift,
  formatShiftDate,
  formatShiftTime,
  markShiftEnRoute,
  SHIFT_STATUS_COLORS,
  SHIFT_STATUS_LABELS,
  type ShiftStatus,
  type WorkerShift,
} from "@/app/lib/workerShifts";

type Props = {
  compact?: boolean;
};

function StatusBadge({ status }: { status: ShiftStatus }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SHIFT_STATUS_COLORS[status]}`}
    >
      {SHIFT_STATUS_LABELS[status]}
    </span>
  );
}

function ShiftActions({
  shift,
  userKey,
  compact,
}: {
  shift: WorkerShift;
  userKey: string;
  compact?: boolean;
}) {
  const buttonClass = compact
    ? "rounded-full px-3 py-1.5 text-[11px] font-bold transition"
    : "rounded-full px-4 py-2 text-xs font-bold transition";

  if (shift.status === "scheduled") {
    return (
      <button
        type="button"
        onClick={() => confirmShift(userKey, shift.id)}
        className={`${buttonClass} bg-[#1db954] text-white hover:bg-[#17a34a]`}
      >
        Confirm shift
      </button>
    );
  }

  if (shift.status === "confirmed") {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => markShiftEnRoute(userKey, shift.id)}
          className={`${buttonClass} border border-zinc-300 text-zinc-700 hover:bg-zinc-50`}
        >
          On my way
        </button>
        <button
          type="button"
          onClick={() => clockInToShift(userKey, shift.id)}
          className={`${buttonClass} bg-[#1db954] text-white hover:bg-[#17a34a]`}
        >
          Clock in
        </button>
      </div>
    );
  }

  if (shift.status === "en-route") {
    return (
      <button
        type="button"
        onClick={() => clockInToShift(userKey, shift.id)}
        className={`${buttonClass} bg-[#1db954] text-white hover:bg-[#17a34a]`}
      >
        Clock in · GPS verify
      </button>
    );
  }

  if (shift.status === "clocked-in") {
    return (
      <button
        type="button"
        onClick={() => clockOutOfShift(userKey, shift.id)}
        className={`${buttonClass} bg-zinc-900 text-white hover:bg-zinc-800`}
      >
        Clock out
      </button>
    );
  }

  if (shift.status === "completed" && shift.clockedInAt) {
    return (
      <p className="text-[11px] text-zinc-500">
        {formatShiftTime(shift.clockedInAt)}
        {shift.clockedOutAt ? ` – ${formatShiftTime(shift.clockedOutAt)}` : ""}
        {" · "}
        <span className="font-semibold text-[#1db954]">GPS ✓</span>
      </p>
    );
  }

  return null;
}

function ShiftRow({
  shift,
  userKey,
  highlight,
  compact,
}: {
  shift: WorkerShift;
  userKey: string;
  highlight?: boolean;
  compact?: boolean;
}) {
  return (
    <li
      className={`px-4 py-3 ${highlight ? "bg-[#1db954]/5" : ""} ${compact ? "" : "border-b border-zinc-100 last:border-0"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-zinc-900">{shift.company}</p>
          <p className="truncate text-xs text-zinc-600">{shift.jobTitle}</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {formatShiftDate(shift.shiftDate)} · {shift.startTime} – {shift.endTime}
          </p>
          {!compact && (
            <p className="mt-0.5 truncate text-[11px] text-zinc-400">{shift.location}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <StatusBadge status={shift.status} />
          <p className="mt-1 text-[11px] font-bold text-zinc-700">{shift.pay}</p>
        </div>
      </div>
      <div className="mt-3">
        <ShiftActions shift={shift} userKey={userKey} compact={compact} />
      </div>
    </li>
  );
}

export function WorkerShiftTracker({ compact = false }: Props) {
  const { userKey, shifts, activeShift, nextShift, loading } = useWorkerShifts();

  if (loading || !userKey) return null;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = shifts.filter(
    (shift) =>
      ["scheduled", "confirmed", "en-route", "clocked-in"].includes(shift.status) &&
      shift.shiftDate >= today,
  );
  const past = shifts.filter(
    (shift) => shift.status === "completed" || shift.shiftDate < today,
  );
  const focusShift = activeShift ?? nextShift;

  if (compact) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Shift tracker</h2>
            <p className="text-[11px] text-zinc-500">GPS clock-in · live status</p>
          </div>
          <Link
            href="/worker/tracker"
            className="text-xs font-bold text-[#1db954] hover:underline"
          >
            Open →
          </Link>
        </div>

        {focusShift ? (
          <ShiftRow shift={focusShift} userKey={userKey} highlight compact />
        ) : (
          <p className="px-4 py-6 text-center text-xs text-zinc-500">
            No upcoming shifts.{" "}
            <Link href="/worker/jobs" className="font-bold text-[#1db954]">
              Browse jobs
            </Link>
          </p>
        )}

        {upcoming.length > 1 && (
          <div className="border-t border-zinc-100 px-4 py-2.5">
            <p className="text-[11px] text-zinc-500">
              +{upcoming.length - 1} more upcoming shift
              {upcoming.length - 1 === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Live tracker
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          My shifts
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Confirm shifts, clock in with GPS verification, and track your schedule.
        </p>
      </div>

      {activeShift && (
        <div className="mb-6 overflow-hidden rounded-xl border-2 border-[#1db954]/30 bg-[#1db954]/5 shadow-sm">
          <div className="border-b border-[#1db954]/20 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a5c42]">
              Active shift
            </p>
          </div>
          <ShiftRow shift={activeShift} userKey={userKey} highlight />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-900">Upcoming</h2>
          <span className="text-xs text-zinc-500">{upcoming.length} shift(s)</span>
        </div>
        {upcoming.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            No upcoming shifts scheduled.
          </p>
        ) : (
          <ul>
            {upcoming.map((shift) => (
              <ShiftRow key={shift.id} shift={shift} userKey={userKey} />
            ))}
          </ul>
        )}
      </div>

      {past.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zinc-900">Past shifts</h2>
          </div>
          <ul>
            {past.map((shift) => (
              <ShiftRow key={shift.id} shift={shift} userKey={userKey} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
