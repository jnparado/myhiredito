"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HowWeHelpMegaMenu } from "./HowWeHelpMegaMenu";
import { PlatformMegaMenu } from "./PlatformMegaMenu";
import { ResourcesMegaMenu } from "./ResourcesMegaMenu";
import { WhoWeServeMegaMenu } from "./WhoWeServeMegaMenu";

type OpenMenu = "platform" | "how-we-help" | "who-we-serve" | "resources" | null;

function ChevronDown({ up }: { up?: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition ${up ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function navButtonClass(active: boolean) {
  return `inline-flex items-center gap-1 border-b-2 pb-0.5 text-[11px] font-bold uppercase tracking-wide transition ${
    active
      ? "border-[#1db954] text-white"
      : "border-transparent text-white hover:text-white/80"
  }`;
}

function workerNavLinkClass(active: boolean) {
  return `font-mono text-[11px] font-bold uppercase tracking-widest transition ${
    active ? "text-white" : "text-white/80 hover:text-white"
  }`;
}

const workerNavItems = [
  { label: "Find Work", href: "/worker/jobs", match: (path: string | null) => !!path?.startsWith("/worker/jobs") },
  { label: "How It Works", href: "/worker#how-it-works", match: () => false },
  { label: "Help", href: "#", match: () => false },
] as const;

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const pathname = usePathname();
  const isWorkersLanding = pathname === "/worker";
  const isEmployersView = !isWorkersLanding;

  return (
    <nav
      className="relative z-50 border-b-2 border-[#1db954] bg-[#0f1115]"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 lg:gap-6 lg:px-6">
        <Link
          href="/"
          className="shrink-0 font-brand text-2xl font-bold text-white lg:text-[1.75rem]"
          aria-label="MyHiredito home"
        >
          MyHiredito
        </Link>

        <div className="hidden items-center rounded-full border border-white/20 bg-white/5 p-0.5 md:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
              isEmployersView
                ? "bg-white text-zinc-900"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Employers
          </Link>
          <Link
            href="/worker"
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
              isWorkersLanding
                ? "bg-[#1db954] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Workers
          </Link>
        </div>

        <div className="hidden items-center gap-5 lg:flex xl:gap-6">
          {isEmployersView ? (
            <>
              <button
                type="button"
                className={navButtonClass(openMenu === "platform")}
                onMouseEnter={() => setOpenMenu("platform")}
                onClick={() => setOpenMenu((m) => (m === "platform" ? null : "platform"))}
              >
                Platform
                <ChevronDown />
              </button>
              <button
                type="button"
                className={navButtonClass(openMenu === "how-we-help")}
                onMouseEnter={() => setOpenMenu("how-we-help")}
                onClick={() => setOpenMenu((m) => (m === "how-we-help" ? null : "how-we-help"))}
              >
                How we help
                <ChevronDown />
              </button>
              <button
                type="button"
                className={navButtonClass(openMenu === "who-we-serve")}
                onMouseEnter={() => setOpenMenu("who-we-serve")}
                onClick={() => setOpenMenu((m) => (m === "who-we-serve" ? null : "who-we-serve"))}
              >
                Who we serve
                <ChevronDown />
              </button>
              <button
                type="button"
                className={navButtonClass(openMenu === "resources")}
                onMouseEnter={() => setOpenMenu("resources")}
                onClick={() => setOpenMenu((m) => (m === "resources" ? null : "resources"))}
              >
                Resources
                <ChevronDown up={openMenu === "resources"} />
              </button>
            </>
          ) : (
            workerNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={workerNavLinkClass(item.match(pathname))}
              >
                {item.label}
              </Link>
            ))
          )}
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            href="/worker/login"
            className="rounded bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
          >
            Login
          </Link>
          <Link
            href="/worker/signup"
            className="rounded border border-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            Signup
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto rounded p-2 text-white lg:hidden"
          aria-label="Menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isEmployersView && openMenu === "platform" && <PlatformMegaMenu />}
      {isEmployersView && openMenu === "how-we-help" && <HowWeHelpMegaMenu />}
      {isEmployersView && openMenu === "who-we-serve" && <WhoWeServeMegaMenu />}
      {isEmployersView && openMenu === "resources" && <ResourcesMegaMenu />}

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0f1115] px-4 py-4 lg:hidden">
          <div className="mb-4 flex rounded-full border border-white/20 p-0.5">
            <Link
              href="/"
              className={`flex-1 rounded-full py-2 text-center text-[11px] font-bold uppercase ${
                isEmployersView ? "bg-white text-zinc-900" : "text-zinc-400"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Employers
            </Link>
            <Link
              href="/worker"
              className={`flex-1 rounded-full py-2 text-center text-[11px] font-bold uppercase ${
                isWorkersLanding ? "bg-[#1db954] text-white" : "text-zinc-400"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Workers
            </Link>
          </div>

          {isEmployersView ? (
            <>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                What are you trying to solve?
              </p>
              <div className="mb-4 flex flex-col gap-3">
                {[
                  "I need to fill a shift — fast",
                  "I want to hire full-time",
                  "I need to pay my workers",
                  "I'm a professional looking for work",
                ].map((label) => (
                  <Link
                    key={label}
                    href={label.includes("professional") ? "/worker/jobs" : "/employer"}
                    className="text-[11px] font-bold uppercase text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Resources
              </p>
              <div className="mb-4 flex flex-col gap-3">
                {["Blog", "Customer Stories", "Help Center", "Careers"].map((label) => (
                  <Link
                    key={label}
                    href={label === "Customer Stories" ? "/#resources" : "#"}
                    className="text-[11px] font-bold uppercase text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="mb-4 flex flex-col gap-3">
              {workerNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-mono text-[11px] font-bold uppercase tracking-widest text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 text-[11px] font-bold uppercase tracking-wide text-white">
            <hr className="border-white/10" />
            <Link href="/worker/login" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link
              href="/worker/signup"
              className="rounded border border-white py-2.5 text-center"
              onClick={() => setMobileOpen(false)}
            >
              Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
