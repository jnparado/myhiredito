"use client";

import Link from "next/link";
import { MyHireditoLogo } from "../brand/MyHireditoLogo";
import {
  AudienceToggle,
  getAuthAudienceHrefs,
  type Audience,
} from "../brand/AudienceToggle";

type AuthVariant = "worker" | "employer";
type AuthMode = "login" | "signup";

const panelContent = {
  worker: {
    badge: "For staffing professionals",
    title: "Work when you want. Get paid fast.",
    description:
      "Pick up shifts at top healthcare facilities, restaurants, and venues. Set your schedule and build a verified track record.",
    image: "/workers-hero.png",
    imageAlt: "Healthcare and hospitality professionals",
    perks: [
      "AI-matched shifts in your market",
      "Same-day pay after every shift",
      "Ratings that open more opportunities",
    ],
    accountLabel: "Worker account",
    switchPrompt: "Hiring instead?",
    switchLink: { login: "/employer/login", signup: "/employer/signup" },
    switchLabel: "Employer",
    homeHref: "/worker",
  },
  employer: {
    badge: "For employers",
    title: "The platform that runs your labor.",
    description:
      "Fill shifts fast with verified pros, manage coverage at scale, and stay compliant — all in one workforce platform.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80",
    imageAlt: "Professional team at work",
    perks: [
      "95% fill rate on open shifts",
      "Verified pros before day one",
      "Payroll and compliance built in",
    ],
    accountLabel: "Employer account",
    switchPrompt: "Looking for work?",
    switchLink: { login: "/worker/login", signup: "/worker/signup" },
    switchLabel: "Worker",
    homeHref: "/",
  },
} as const;

export function AuthShell({
  variant,
  mode,
  children,
}: {
  variant: AuthVariant;
  mode: AuthMode;
  children: React.ReactNode;
}) {
  const content = panelContent[variant];
  const loginHref = variant === "worker" ? "/worker/login" : "/employer/login";
  const signupHref = variant === "worker" ? "/worker/signup" : "/employer/signup";
  const activeAudience: Audience = variant === "employer" ? "employers" : "workers";
  const audienceHrefs = getAuthAudienceHrefs(mode);

  return (
    <div className="flex min-h-screen flex-col bg-[#0f1115] lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[48%] lg:flex-col">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.image}
            alt={content.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-[#0f1115]/30" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-10 xl:p-14">
          <MyHireditoLogo href="/" theme="dark" size="lg" />

          <div className="mt-auto max-w-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
              {content.badge}
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-white xl:text-5xl">
              {content.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              {content.description}
            </p>
            <ul className="mt-8 space-y-3">
              {content.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 text-sm text-zinc-200"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1db954]/20 text-[#1db954]">
                    ✓
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col bg-zinc-50">
        <header className="border-b-2 border-[#1db954] bg-[#0f1115] px-4 py-3 lg:border-b-0 lg:bg-zinc-50 lg:px-8 lg:py-6">
          <div className="mx-auto flex max-w-md items-center justify-between lg:max-w-lg">
            <MyHireditoLogo href="/" theme="dark" size="md" className="lg:hidden" />
            <MyHireditoLogo href="/" theme="light" size="md" className="hidden lg:inline-flex" />
            <AudienceToggle
              active={activeAudience}
              employersHref={audienceHrefs.employersHref}
              workersHref={audienceHrefs.workersHref}
              theme="dark"
              className="lg:hidden"
            />
            <AudienceToggle
              active={activeAudience}
              employersHref={audienceHrefs.employersHref}
              workersHref={audienceHrefs.workersHref}
              theme="light"
              className="hidden lg:inline-flex"
            />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md lg:max-w-lg">
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-[#1db954]">
              {content.accountLabel}
            </p>

            <div className="mt-4 flex justify-center">
              <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
                <Link
                  href={loginHref}
                  className={`rounded-full px-6 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                    mode === "login"
                      ? "bg-[#0f1115] text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href={signupHref}
                  className={`rounded-full px-6 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                    mode === "signup"
                      ? "bg-[#0f1115] text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              {children}
            </div>

            <p className="mt-6 text-center text-sm text-zinc-500">
              {content.switchPrompt}{" "}
              <Link
                href={content.switchLink[mode]}
                className="font-semibold text-zinc-900 hover:text-[#1db954] hover:underline"
              >
                {content.switchLabel} {mode === "login" ? "log in" : "sign up"}
              </Link>
            </p>

            <p className="mt-3 text-center text-xs text-zinc-400">
              <Link href={content.homeHref} className="hover:text-zinc-600 hover:underline">
                ← Back to {variant === "worker" ? "workers" : "employers"} page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const authFieldClass =
  "h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20";

export const authLabelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-zinc-500";

export const authButtonClass =
  "inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1db954] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#17a34a] disabled:cursor-not-allowed disabled:opacity-60";

export const authErrorClass =
  "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700";
