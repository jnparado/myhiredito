"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Category = "all" | "kitchen" | "bar" | "events" | "foh" | "boh";

type Role = {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  icon: string;
  iconBg: string;
  hourlyRate: number;
};

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bar", label: "Bar" },
  { id: "events", label: "Events" },
  { id: "foh", label: "FOH" },
  { id: "boh", label: "BOH" },
];

const roles: Role[] = [
  {
    id: "line-cook",
    title: "Line Cook",
    description: "Skilled culinary professionals ready for any station.",
    category: "kitchen",
    icon: "🔪",
    iconBg: "bg-rose-100",
    hourlyRate: 22,
  },
  {
    id: "prep-cook",
    title: "Prep Cook",
    description: "Efficient prep support for fast-paced kitchens.",
    category: "kitchen",
    icon: "🥕",
    iconBg: "bg-emerald-100",
    hourlyRate: 18,
  },
  {
    id: "bartender",
    title: "Bartender",
    description: "Full-service bar coverage for events, venues, and restaurants.",
    category: "bar",
    icon: "🍸",
    iconBg: "bg-rose-100",
    hourlyRate: 24,
  },
  {
    id: "event-staff",
    title: "Event Staff",
    description: "General event support for a wide range of functions.",
    category: "events",
    icon: "🪩",
    iconBg: "bg-violet-100",
    hourlyRate: 17,
  },
  {
    id: "foh-support",
    title: "FOH Support",
    description: "Flexible front-of-house support for fast-paced venues.",
    category: "foh",
    icon: "🔔",
    iconBg: "bg-emerald-100",
    hourlyRate: 16,
  },
  {
    id: "dishwasher",
    title: "Dishwasher",
    description: "Cleaning and sanitation for high-volume kitchens.",
    category: "boh",
    icon: "🧽",
    iconBg: "bg-emerald-100",
    hourlyRate: 15,
  },
];

type BookingState = Record<string, { staff: number; hours: number }>;

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex-1">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <div className="flex items-center justify-between rounded border border-zinc-200 bg-white">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          className="px-3 py-2 text-lg text-zinc-400 transition hover:text-zinc-900"
          onClick={() => onChange(Math.max(1, value - 1))}
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-sm font-bold text-zinc-900">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          className="px-3 py-2 text-lg text-zinc-400 transition hover:text-zinc-900"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function RoleCard({
  role,
  staff,
  hours,
  onStaffChange,
  onHoursChange,
}: {
  role: Role;
  staff: number;
  hours: number;
  onStaffChange: (n: number) => void;
  onHoursChange: (n: number) => void;
}) {
  const subtotal = staff * hours * role.hourlyRate;

  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-start gap-3 border-b border-zinc-100 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${role.iconBg}`}
        >
          {role.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900">
            {role.title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{role.description}</p>
        </div>
        <span className="shrink-0 text-zinc-300" aria-hidden>
          —
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex gap-3">
          <Counter label="Staff" value={staff} onChange={onStaffChange} />
          <Counter label="Hours" value={hours} onChange={onHoursChange} />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div />
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Subtotal
            </p>
            <p className="mt-0.5 text-sm font-bold text-zinc-900">
              ${subtotal.toLocaleString()}
            </p>
          </div>
        </div>

        <Link
          href={`/employer/signup?role=${role.id}&staff=${staff}&hours=${hours}`}
          className="mt-4 flex h-11 items-center justify-center rounded bg-zinc-900 text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-zinc-800"
        >
          Add to Roster →
        </Link>
      </div>
    </div>
  );
}

export function InstantBookingSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [bookings, setBookings] = useState<BookingState>(() =>
    Object.fromEntries(roles.map((r) => [r.id, { staff: 1, hours: 4 }]))
  );

  const filteredRoles = useMemo(
    () =>
      activeCategory === "all"
        ? roles
        : roles.filter((r) => r.category === activeCategory),
    [activeCategory]
  );

  function updateBooking(id: string, field: "staff" | "hours", value: number) {
    setBookings((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  return (
    <section className="border-b border-zinc-100 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
              MyHireditoGo — Instant Booking
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-black uppercase leading-tight tracking-tight text-zinc-900 sm:text-4xl">
              Need staff ASAP?
              <br />
              Book your next shift.
            </h2>
          </div>
          <Link
            href="/employer"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded bg-[var(--brand)] px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[var(--brand-strong)]"
          >
            View All 35+ Roles →
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                activeCategory === cat.id
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              staff={bookings[role.id].staff}
              hours={bookings[role.id].hours}
              onStaffChange={(n) => updateBooking(role.id, "staff", n)}
              onHoursChange={(n) => updateBooking(role.id, "hours", n)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
