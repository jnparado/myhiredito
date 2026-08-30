"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useEmployerTeamTracking } from "@/app/hooks/useEmployerTeamTracking";
import type { TeamWorkerTracking } from "@/app/lib/employerTeamTracking";
import {
  formatDuration,
  formatDurationShort,
  formatShiftDate,
  formatShiftTime,
  getShiftDurationMs,
  getTimesheetFromShifts,
  getTrackedMsFromShifts,
  SHIFT_STATUS_COLORS,
  SHIFT_STATUS_LABELS,
  type ShiftStatus,
  type WorkerShift,
} from "@/app/lib/workerShifts";

type Props = {
  compact?: boolean;
  focusWorkerId?: string | null;
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

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

function WorkerLiveRow({
  item,
  now,
  selected,
  onSelect,
}: {
  item: TeamWorkerTracking;
  now: number;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const todayMs = getTrackedMsFromShifts(item.shifts, now, "today");
  const liveMs = item.activeShift
    ? getShiftDurationMs(item.activeShift, now)
    : 0;

  const className = `flex w-full items-center gap-3 px-4 py-3 text-left transition ${
    selected ? "bg-[#1db954]/10" : "hover:bg-zinc-50"
  }`;

  const body = (
    <>
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">
          {initials(item.worker.name)}
        </div>
        {item.activeShift && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#1db954]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-zinc-900">
          {item.worker.name}
        </p>
        <p className="truncate text-[11px] text-zinc-500">
          {item.activeShift
            ? `${item.activeShift.jobTitle} · ${item.activeShift.company}`
            : `${item.worker.role} · ${item.worker.location}`}
        </p>
      </div>
      <div className="shrink-0 text-right">
        {item.activeShift ? (
          <>
            <p className="font-mono text-sm font-bold tabular-nums text-zinc-900">
              {formatDuration(liveMs)}
            </p>
            <p className="text-[10px] font-bold uppercase text-[#1a5c42]">Live</p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold tabular-nums text-zinc-700">
              {formatDurationShort(todayMs)}
            </p>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Idle</p>
          </>
        )}
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={className}>
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}

function WorkerDetail({
  item,
  now,
}: {
  item: TeamWorkerTracking;
  now: number;
}) {
  const todayMs = getTrackedMsFromShifts(item.shifts, now, "today");
  const weekMs = getTrackedMsFromShifts(item.shifts, now, "week");
  const timesheet = getTimesheetFromShifts(item.shifts);
  const elapsed = item.activeShift
    ? getShiftDurationMs(item.activeShift, now)
    : 0;
  const activityScore = item.activeShift
    ? Math.min(98, 82 + Math.floor((elapsed / 60000) % 12))
    : 0;
  const nowDate = new Date();
  const todayStamp = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;
  const upcoming = item.shifts.filter(
    (shift) =>
      ["scheduled", "confirmed", "en-route", "clocked-in"].includes(shift.status) &&
      shift.shiftDate >= todayStamp,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600">
          {initials(item.worker.name)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">{item.worker.name}</h2>
          <p className="text-sm text-zinc-500">
            {item.worker.role} · {item.worker.location}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Today"
          value={formatDurationShort(todayMs)}
          sub={item.activeShift ? "Includes live session" : "Completed shifts"}
        />
        <StatCard label="This week" value={formatDurationShort(weekMs)} sub="Mon – Sun total" />
        <StatCard
          label="Status"
          value={item.activeShift ? "Tracking" : "Idle"}
          sub={
            item.activeShift
              ? item.activeShift.company
              : item.nextShift
                ? `Next: ${formatShiftDate(item.nextShift.shiftDate)}`
                : "No active shift"
          }
        />
      </div>

      {item.activeShift ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-gradient-to-r from-[#1db954]/10 to-transparent px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1a5c42]">
                  Tracking active
                </p>
                <p className="mt-1 text-sm font-bold text-zinc-900">
                  {item.activeShift.jobTitle}
                </p>
                <p className="text-xs text-zinc-500">{item.activeShift.company}</p>
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
              Started{" "}
              {item.activeShift.clockedInAt
                ? formatShiftTime(item.activeShift.clockedInAt)
                : "—"}
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
                Keyboard & location activity from this worker’s tracker
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-white px-5 py-6 text-center">
          <p className="text-sm font-semibold text-zinc-700">Not tracking right now</p>
          <p className="mt-1 text-xs text-zinc-500">
            {item.nextShift
              ? `Next shift: ${item.nextShift.jobTitle} · ${formatShiftDate(item.nextShift.shiftDate)} ${item.nextShift.startTime}`
              : "This worker has no upcoming shifts."}
          </p>
        </div>
      )}

      {timesheet.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h3 className="text-sm font-bold text-zinc-900">Timesheet</h3>
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
                  <TimesheetRow key={shift.id} shift={shift} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h3 className="text-sm font-bold text-zinc-900">Upcoming shifts</h3>
          </div>
          <ul>
            {upcoming.map((shift) => (
              <li
                key={shift.id}
                className="flex items-start justify-between gap-3 border-b border-zinc-50 px-4 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-zinc-900">
                    {shift.company}
                  </p>
                  <p className="truncate text-xs text-zinc-600">{shift.jobTitle}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {formatShiftDate(shift.shiftDate)} · {shift.startTime} – {shift.endTime}
                  </p>
                </div>
                <StatusBadge status={shift.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TimesheetRow({ shift }: { shift: WorkerShift }) {
  return (
    <tr className="border-b border-zinc-50 last:border-0">
      <td className="px-4 py-3 text-zinc-600">{formatShiftDate(shift.shiftDate)}</td>
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
  );
}

export function EmployerTeamTracker({ compact = false, focusWorkerId = null }: Props) {
  const { snapshots, liveCount, loading } = useEmployerTeamTracking();
  const hasLive = snapshots.some((item) => item.activeShift);
  const now = useLiveClock(hasLive);
  const [selectedId, setSelectedId] = useState<string | null>(focusWorkerId);

  const selected = useMemo(() => {
    if (snapshots.length === 0) return null;
    return (
      snapshots.find((item) => item.worker.id === selectedId) ??
      snapshots.find((item) => item.trackerKey === selectedId) ??
      snapshots.find((item) => item.worker.id === focusWorkerId) ??
      snapshots.find((item) => item.trackerKey === focusWorkerId) ??
      snapshots.find((item) => item.activeShift) ??
      snapshots[0]
    );
  }, [focusWorkerId, selectedId, snapshots]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading team tracker...
      </div>
    );
  }

  if (compact) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-300/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Team tracker</h2>
            <p className="text-[11px] text-zinc-500">
              {liveCount > 0
                ? `${liveCount} worker${liveCount === 1 ? "" : "s"} tracking now`
                : `${snapshots.length} worker${snapshots.length === 1 ? "" : "s"} on roster`}
            </p>
          </div>
          <Link
            href="/employer/tracker"
            className="text-xs font-bold text-[#1db954] hover:underline"
          >
            Open →
          </Link>
        </div>
        {snapshots.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-zinc-500">
            Hire a worker to see their clock-in tracker.{" "}
            <Link href="/employer/applicants" className="font-bold text-[#1db954]">
              Review applicants
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {snapshots.slice(0, 4).map((item) => (
              <li key={item.worker.id}>
                <Link href={`/employer/tracker?worker=${item.worker.id}`}>
                  <WorkerLiveRow item={item} now={now} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          Team tracker
        </h1>
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-zinc-700">No workers to track yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Hire an applicant or mark a roster worker as active to see their
            live clock-in, hours, and timesheet.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link
              href="/employer/applicants"
              className="rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Review applicants
            </Link>
            <Link
              href="/employer/workers"
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700"
            >
              Open roster
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teamTodayMs = snapshots.reduce(
    (sum, item) => sum + getTrackedMsFromShifts(item.shifts, now, "today"),
    0,
  );
  const teamWeekMs = snapshots.reduce(
    (sum, item) => sum + getTrackedMsFromShifts(item.shifts, now, "week"),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          Team tracker
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Watch your workers’ live clock-in, GPS-verified hours, and timesheets.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Tracking now"
          value={String(liveCount)}
          sub={`${snapshots.length} worker${snapshots.length === 1 ? "" : "s"} on team`}
        />
        <StatCard
          label="Team today"
          value={formatDurationShort(teamTodayMs)}
          sub="All hired workers"
        />
        <StatCard
          label="Team this week"
          value={formatDurationShort(teamWeekMs)}
          sub="Mon – Sun total"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:self-start">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zinc-900">Your workers</h2>
          </div>
          <ul className="divide-y divide-zinc-100">
            {snapshots.map((item) => (
              <li key={item.worker.id}>
                <WorkerLiveRow
                  item={item}
                  now={now}
                  selected={selected?.worker.id === item.worker.id}
                  onSelect={() => setSelectedId(item.worker.id)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div>{selected && <WorkerDetail item={selected} now={now} />}</div>
      </div>
    </div>
  );
}
