"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Audience = "employers" | "workers";

type AudienceToggleProps = {
  active: Audience;
  employersHref: string;
  workersHref: string;
  theme?: "light" | "dark";
  onNavigate?: () => void;
  className?: string;
  fullWidth?: boolean;
};

export function getAudienceFromPath(pathname: string | null): Audience {
  if (!pathname) return "employers";
  if (pathname.startsWith("/worker")) return "workers";
  if (pathname.startsWith("/employer")) return "employers";
  return "employers";
}

export function getMarketingAudienceHrefs(): {
  employersHref: string;
  workersHref: string;
} {
  return {
    employersHref: "/",
    workersHref: "/worker",
  };
}

export function getAuthAudienceHrefs(mode: "login" | "signup"): {
  employersHref: string;
  workersHref: string;
} {
  return {
    employersHref: mode === "login" ? "/employer/login" : "/employer/signup",
    workersHref: mode === "login" ? "/worker/login" : "/worker/signup",
  };
}

export function AudienceToggle({
  active,
  employersHref,
  workersHref,
  theme = "light",
  onNavigate,
  className = "",
  fullWidth = false,
}: AudienceToggleProps) {
  const isDark = theme === "dark";

  const containerClass = isDark
    ? "border-white/20 bg-white/5"
    : "border-zinc-200 bg-white";

  const inactiveClass = isDark
    ? "text-zinc-400 hover:text-white"
    : "text-zinc-600 hover:text-zinc-900";

  const activeEmployersClass = isDark
    ? "bg-white text-zinc-900"
    : "bg-zinc-900 text-white";

  const activeWorkersClass = isDark
    ? "bg-[#1db954] text-white"
    : "bg-zinc-900 text-white";

  const linkBase = fullWidth
    ? "flex-1 text-center py-2 sm:py-1.5"
    : "px-3 py-1 sm:px-4 sm:py-1.5";

  return (
    <div
      className={`${fullWidth ? "flex w-full" : "inline-flex"} items-center rounded-full border p-0.5 ${containerClass} ${className}`}
      role="tablist"
      aria-label="Choose audience"
    >
      <Link
        href={employersHref}
        role="tab"
        aria-selected={active === "employers"}
        onClick={onNavigate}
        className={`rounded-full text-[10px] font-bold uppercase tracking-wide transition sm:text-[11px] ${linkBase} ${
          active === "employers" ? activeEmployersClass : inactiveClass
        }`}
      >
        Employers
      </Link>
      <Link
        href={workersHref}
        role="tab"
        aria-selected={active === "workers"}
        onClick={onNavigate}
        className={`rounded-full text-[10px] font-bold uppercase tracking-wide transition sm:text-[11px] ${linkBase} ${
          active === "workers" ? activeWorkersClass : inactiveClass
        }`}
      >
        Workers
      </Link>
    </div>
  );
}

/** Resolves toggle state + hrefs for marketing headers from the current route. */
export function useMarketingAudienceToggle(onNavigate?: () => void) {
  const pathname = usePathname();
  const hrefs = getMarketingAudienceHrefs();

  return {
    active: getAudienceFromPath(pathname),
    employersHref: hrefs.employersHref,
    workersHref: hrefs.workersHref,
    onNavigate,
  };
}
