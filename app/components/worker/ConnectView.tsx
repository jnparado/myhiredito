"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  connectSpecialties,
  employerContacts,
  getExamTierLabel,
  getPinnedPeerIds,
  togglePinnedPeer,
  workerPeers,
  type ConnectSpecialty,
  type EmployerContact,
  type WorkerPeer,
} from "@/app/lib/workerConnect";

type Tab = "workers" | "employers";
type SortKey = "match" | "active" | "exam";

function subscribePinned(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("myhiredito-pinned-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("myhiredito-pinned-change", callback);
  };
}

function getPinnedSnapshot() {
  return getPinnedPeerIds();
}

function PeerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-light)] to-white text-sm font-bold text-[var(--brand-dark)] ring-2 ring-white">
      {initials}
    </div>
  );
}

function ExamBadge({ peer }: { peer: WorkerPeer }) {
  if (peer.examTier === "strong") {
    return (
      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        {peer.examScore}% · Strong boost
      </span>
    );
  }
  if (peer.examTier === "moderate") {
    return (
      <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
        {peer.examScore}% · Moderate boost
      </span>
    );
  }
  return (
    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500">
      {getExamTierLabel(peer.examTier)}
    </span>
  );
}

function WorkerCard({
  peer,
  pinned,
  onTogglePin,
}: {
  peer: WorkerPeer;
  pinned: boolean;
  onTogglePin: (id: string) => void;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[var(--brand)]/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <PeerAvatar name={peer.name} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">{peer.name}</h3>
                {peer.verified && (
                  <span className="rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--brand-dark)]">
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-zinc-600">{peer.headline}</p>
              <p className="text-xs text-zinc-400">
                {peer.location} · Active {peer.lastActive}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onTogglePin(peer.id)}
                aria-label={pinned ? "Unpin profile" : "Pin profile"}
                className={`rounded-lg p-2 transition ${
                  pinned
                    ? "bg-[var(--brand-light)] text-[var(--brand-dark)]"
                    : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                }`}
              >
                <svg className="h-5 w-5" fill={pinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </button>
              <Link
                href="/worker/messages"
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                Send intro
              </Link>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">{peer.applications}</span>{" "}
              applications
            </span>
            <ExamBadge peer={peer} />
            {peer.sharedEmployers.length > 0 && (
              <span className="text-xs text-zinc-500">
                Worked at{" "}
                <span className="font-semibold text-zinc-700">
                  {peer.sharedEmployers.join(", ")}
                </span>
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-600">{peer.bio}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-xs font-semibold text-zinc-400">Seeking</span>
            {peer.seeking.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200 bg-[var(--surface)] px-2.5 py-0.5 text-xs text-zinc-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmployerCard({ employer }: { employer: EmployerContact }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[var(--brand)]/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f1115] text-lg font-bold text-white">
            {employer.name.charAt(0)}
          </div>
          <h3 className="mt-3 text-base font-bold text-zinc-900">{employer.name}</h3>
          <p className="text-sm text-zinc-600">
            {employer.industry} · {employer.location}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{employer.about}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
            <span>
              <span className="font-semibold text-zinc-700">{employer.openRoles}</span> open
              roles
            </span>
            <span>
              <span className="font-semibold text-zinc-700">{employer.hiresOnPlatform}</span>{" "}
              hires on MyHiredito
            </span>
            <span>
              <span className="font-semibold text-zinc-700">{employer.responseRate}%</span>{" "}
              response rate
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Link
            href="/worker/jobs"
            className="inline-flex rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--brand-strong)]"
          >
            View openings
          </Link>
          <Link
            href="/worker/messages"
            className="inline-flex rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            Message team
          </Link>
          <p className="text-xs text-zinc-400">Last posted {employer.lastPosted}</p>
        </div>
      </div>
    </article>
  );
}

export function ConnectView() {
  const [tab, setTab] = useState<Tab>("workers");
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState<ConnectSpecialty>("All");
  const [sort, setSort] = useState<SortKey>("match");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const pinnedIds = useSyncExternalStore(
    subscribePinned,
    getPinnedSnapshot,
    () => [] as string[],
  );

  function handleTogglePin(id: string) {
    togglePinnedPeer(id);
    window.dispatchEvent(new Event("myhiredito-pinned-change"));
  }

  const filteredWorkers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = workerPeers.filter((peer) => {
      if (specialty !== "All" && peer.specialty !== specialty) return false;
      if (verifiedOnly && !peer.verified) return false;
      if (showPinnedOnly && !pinnedIds.includes(peer.id)) return false;
      if (!q) return true;
      return (
        peer.name.toLowerCase().includes(q) ||
        peer.headline.toLowerCase().includes(q) ||
        peer.bio.toLowerCase().includes(q) ||
        peer.location.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "exam") {
        return (b.examScore ?? 0) - (a.examScore ?? 0);
      }
      if (sort === "active") {
        return a.lastActive.localeCompare(b.lastActive);
      }
      const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
      if (bPinned !== aPinned) return bPinned - aPinned;
      return (b.examScore ?? 0) - (a.examScore ?? 0);
    });

    return list;
  }, [search, specialty, sort, verifiedOnly, showPinnedOnly, pinnedIds]);

  const filteredEmployers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employerContacts.filter((employer) => {
      if (specialty !== "All" && !employer.specialties.includes(specialty)) return false;
      if (!q) return true;
      return (
        employer.name.toLowerCase().includes(q) ||
        employer.industry.toLowerCase().includes(q) ||
        employer.location.toLowerCase().includes(q) ||
        employer.about.toLowerCase().includes(q)
      );
    });
  }, [search, specialty]);

  const resultCount = tab === "workers" ? filteredWorkers.length : filteredEmployers.length;

  return (
    <div className="min-h-full bg-[var(--surface)] pb-10">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
                Worker network
              </p>
              <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">Your Circle</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                Discover verified workers in your field and employers you may want to work with.
                Pin profiles, send intros, and explore teams hiring on MyHiredito.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  tab === "workers"
                    ? "Search by name, role, or city..."
                    : "Search employers or industry..."
                }
                className="h-11 w-full rounded-xl border border-zinc-200 bg-[var(--surface)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
              />
            </div>
          </div>

          {/* Tabs — segmented control, not full-width bar */}
          <div className="mt-6 inline-flex rounded-xl border border-zinc-200 bg-[var(--surface)] p-1">
            <button
              type="button"
              onClick={() => setTab("workers")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                tab === "workers"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Workers
            </button>
            <button
              type="button"
              onClick={() => setTab("employers")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                tab === "employers"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Employers
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar filters — vertical, not horizontal icon row */}
          <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-56">
            <div className="space-y-5 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Specialty
                </p>
                <div className="mt-2 space-y-1">
                  {connectSpecialties.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSpecialty(item)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                        specialty === item
                          ? "bg-[var(--brand-light)] text-[var(--brand-dark)]"
                          : "text-zinc-600 hover:bg-[var(--surface)]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {tab === "workers" && (
                <>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Sort by
                    </p>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
                    >
                      <option value="match">Best match</option>
                      <option value="active">Recently active</option>
                      <option value="exam">Exam score</option>
                    </select>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-zinc-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                    />
                    Verified only
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                    <input
                      type="checkbox"
                      checked={showPinnedOnly}
                      onChange={(e) => setShowPinnedOnly(e.target.checked)}
                      className="rounded border-zinc-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                    />
                    Pinned only ({pinnedIds.length})
                  </label>
                </>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-zinc-600">
                <span className="font-bold text-zinc-900">{resultCount}</span>{" "}
                {tab === "workers" ? "workers" : "employers"} found
                {specialty !== "All" && (
                  <span>
                    {" "}
                    in <span className="font-semibold">{specialty}</span>
                  </span>
                )}
              </p>
              {tab === "workers" && pinnedIds.length > 0 && (
                <p className="text-xs font-semibold text-[var(--brand)]">
                  {pinnedIds.length} pinned
                </p>
              )}
            </div>

            <div className="space-y-4">
              {resultCount === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
                  <p className="font-semibold text-zinc-800">No matches</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Try a different specialty or clear your filters.
                  </p>
                </div>
              ) : tab === "workers" ? (
                filteredWorkers.map((peer) => (
                  <WorkerCard
                    key={peer.id}
                    peer={peer}
                    pinned={pinnedIds.includes(peer.id)}
                    onTogglePin={handleTogglePin}
                  />
                ))
              ) : (
                filteredEmployers.map((employer) => (
                  <EmployerCard key={employer.id} employer={employer} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
