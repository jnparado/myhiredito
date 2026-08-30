"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWorkerShifts } from "@/app/hooks/useWorkerShifts";
import {
  clockInToShift,
  clockOutOfShift,
  confirmShift,
  formatDuration,
  formatDurationShort,
  formatShiftDate,
  formatShiftTime,
  getShiftDurationMs,
  getTimesheetFromShifts,
  getTrackedMsFromShifts,
  markShiftEnRoute,
  localDateStamp,
  SHIFT_STATUS_COLORS,
  SHIFT_STATUS_LABELS,
  type ShiftStatus,
  type WorkerShift,
} from "@/app/lib/workerShifts";

type Props = {
  compact?: boolean;
};

function useLiveClock(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return now;
}

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
          Start tracking
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
        className={`${buttonClass} bg-red-600 text-white hover:bg-red-700`}
      >
        Stop tracking
      </button>
    );
  }

  if (shift.status === "completed" && shift.clockedInAt) {
    return (
      <p className="text-[11px] text-zinc-500">
        {formatShiftTime(shift.clockedInAt)}
        {shift.clockedOutAt ? ` – ${formatShiftTime(shift.clockedOutAt)}` : ""}
        {" · "}
        {formatDurationShort(getShiftDurationMs(shift))}
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

function LiveTimerHero({
  shift,
  userKey,
  now,
}: {
  shift: WorkerShift;
  userKey: string;
  now: number;
}) {
  const elapsed = getShiftDurationMs(shift, now);
  const activityScore = Math.min(
    98,
    82 + Math.floor((elapsed / 60000) % 12),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 bg-gradient-to-r from-[#1db954]/10 to-transparent px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1a5c42]">
              Tracking active
            </p>
            <p className="mt-1 text-sm font-bold text-zinc-900">{shift.jobTitle}</p>
            <p className="text-xs text-zinc-500">{shift.company}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#1db954]/15 px-3 py-1 text-[11px] font-bold text-[#1a5c42]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#1db954]" />
            Live
          </span>
        </div>
      </div>

      <div className="px-5 py-8 text-center">
        <p className="font-mono text-5xl font-bold tabular-nums tracking-tight text-zinc-900 sm:text-6xl">
          {formatDuration(elapsed)}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Started {shift.clockedInAt ? formatShiftTime(shift.clockedInAt) : "—"}
          {" · GPS verified"}
        </p>

        <div className="mx-auto mt-6 max-w-xs">
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-zinc-500">
            <span>Activity</span>
            <span className="text-[#1a5c42]">{activityScore}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-[#1db954] transition-all duration-1000"
              style={{ width: `${activityScore}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-zinc-400">
            Keyboard & location activity monitored like Time Doctor
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <ShiftActions shift={shift} userKey={userKey} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>}
    </div>
  );
}

export function WorkerShiftTracker({ compact = false }: Props) {
  const { userKey, shifts, activeShift, nextShift, loading } = useWorkerShifts();
  const now = useLiveClock(!!activeShift);

  if (loading || !userKey) return null;

  const today = localDateStamp();
  const upcoming = shifts.filter(
    (shift) =>
      ["scheduled", "confirmed", "en-route", "clocked-in"].includes(shift.status) &&
      shift.shiftDate >= today,
  );
  const past = shifts.filter(
    (shift) => shift.status === "completed" || shift.shiftDate < today,
  );
  const focusShift = activeShift ?? nextShift;
  const todayMs = getTrackedMsFromShifts(shifts, now, "today");
  const weekMs = getTrackedMsFromShifts(shifts, now, "week");
  const timesheet = getTimesheetFromShifts(shifts);

  if (compact) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Time tracker</h2>
            <p className="text-[11px] text-zinc-500">
              {activeShift
                ? formatDuration(getShiftDurationMs(activeShift, now))
                : `${formatDurationShort(todayMs)} today`}
            </p>
          </div>
          <Link
            href="/worker/tracker"
            className="text-xs font-bold text-[#1db954] hover:underline"
          >
            Open →
          </Link>
        </div>

        {activeShift ? (
          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-700">
                {activeShift.company}
              </p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#1a5c42]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1db954]" />
                Tracking
              </span>
            </div>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums text-zinc-900">
              {formatDuration(getShiftDurationMs(activeShift, now))}
            </p>
          </div>
        ) : focusShift ? (
          <ShiftRow shift={focusShift} userKey={userKey} highlight compact />
        ) : (
          <p className="px-4 py-6 text-center text-xs text-zinc-500">
            No upcoming shifts.{" "}
            <Link href="/worker/jobs" className="font-bold text-[#1db954]">
              Browse jobs
            </Link>
          </p>
        )}

        {upcoming.length > 1 && !activeShift && (
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Time Doctor style
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          Time tracker
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Clock in with GPS, track live hours, and review your timesheet.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Today"
          value={formatDurationShort(todayMs)}
          sub={activeShift ? "Includes live session" : "Completed shifts"}
        />
        <StatCard
          label="This week"
          value={formatDurationShort(weekMs)}
          sub="Mon – Sun total"
        />
        <StatCard
          label="Status"
          value={activeShift ? "Tracking" : "Idle"}
          sub={activeShift ? shiftLocationLabel(activeShift) : "Start a shift to track"}
        />
      </div>

      {activeShift ? (
        <div className="mb-6">
          <LiveTimerHero shift={activeShift} userKey={userKey} now={now} />
        </div>
      ) : nextShift ? (
        <div className="mb-6 overflow-hidden rounded-xl border-2 border-dashed border-[#1db954]/40 bg-[#1db954]/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1a5c42]">
            Ready to track
          </p>
          <p className="mt-2 text-lg font-bold text-zinc-900">{nextShift.jobTitle}</p>
          <p className="text-sm text-zinc-600">
            {nextShift.company} · {formatShiftDate(nextShift.shiftDate)}
          </p>
          <div className="mt-4">
            <ShiftActions shift={nextShift} userKey={userKey} />
          </div>
        </div>
      ) : null}

      {timesheet.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zinc-900">Timesheet</h2>
            <p className="text-[11px] text-zinc-500">Completed tracked sessions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Shift</th>
                  <th className="px-4 py-2.5">Clock in</th>
                  <th className="px-4 py-2.5">Clock out</th>
                  <th className="px-4 py-2.5 text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {timesheet.map((shift) => (
                  <tr key={shift.id} className="border-b border-zinc-50 last:border-0">
                    <td className="px-4 py-3 text-zinc-600">
                      {formatShiftDate(shift.shiftDate)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">{shift.company}</p>
                      <p className="text-xs text-zinc-500">{shift.jobTitle}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {shift.clockedInAt ? formatShiftTime(shift.clockedInAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {shift.clockedOutAt ? formatShiftTime(shift.clockedOutAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-zinc-900">
                      {formatDurationShort(getShiftDurationMs(shift))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-900">Upcoming shifts</h2>
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

function shiftLocationLabel(shift: WorkerShift): string {
  const parts = shift.location.split(",");
  return parts[0]?.trim() ?? shift.location;
}
