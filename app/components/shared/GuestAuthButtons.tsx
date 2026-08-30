"use client";

import Link from "next/link";

type Role = "worker" | "employer";
type Theme = "dark" | "light";

const ROUTES = {
  worker: { login: "/worker/login", signup: "/worker/signup" },
  employer: { login: "/employer/login", signup: "/employer/signup" },
} as const;

type Props = {
  role: Role;
  theme?: Theme;
  onNavigate?: () => void;
};

export function GuestAuthButtons({ role, theme = "dark", onNavigate }: Props) {
  const { login, signup } = ROUTES[role];

  if (theme === "light") {
    return (
      <>
        <Link
          href={login}
          onClick={onNavigate}
          className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          Login
        </Link>
        <Link
          href={signup}
          onClick={onNavigate}
          className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          Signup
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href={login}
        onClick={onNavigate}
        className="rounded bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
      >
        Login
      </Link>
      <Link
        href={signup}
        onClick={onNavigate}
        className="rounded border border-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
      >
        Signup
      </Link>
    </>
  );
}

export function guestAuthRoleFromPath(pathname: string | null): Role {
  if (pathname?.startsWith("/worker")) return "worker";
  return "employer";
}
