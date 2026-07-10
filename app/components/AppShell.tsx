"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MyHireditoLogo } from "./brand/MyHireditoLogo";

const HIDE_CHROME_PATHS = new Set([
  "/employer/login",
  "/employer/signup",
  "/freelancer/login",
  "/freelancer/signup",
  "/worker/login",
  "/worker/signup",
]);

function shouldHideAllChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  if (HIDE_CHROME_PATHS.has(pathname)) return true;
  if (/^\/worker\/jobs\/[^/]+(\/assessment)?$/.test(pathname)) return true;
  if (pathname === "/worker/dashboard" || pathname === "/worker/jobs") return true;
  if (pathname === "/worker/connect") return true;
  if (pathname?.startsWith("/worker/messages")) return true;
  if (pathname?.startsWith("/worker/onboarding")) return true;
  if (pathname === "/employer/dashboard") return true;
  if (pathname?.startsWith("/employer/onboarding")) return true;
  if (pathname?.startsWith("/employer/messages")) return true;
  if (pathname?.startsWith("/employer/applicants")) return true;
  if (pathname?.startsWith("/employer/workers")) return true;
  if (pathname?.startsWith("/employer/billing")) return true;
  if (pathname?.startsWith("/employer/reports")) return true;
  if (pathname?.startsWith("/employer/profile")) return true;
  return false;
}

function shouldHideHeader(pathname: string | null): boolean {
  if (shouldHideAllChrome(pathname)) return true;
  if (pathname === "/" || pathname === "/worker") return true;
  return false;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = shouldHideHeader(pathname);
  const hideFooter = shouldHideAllChrome(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {!hideHeader && (
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
            <MyHireditoLogo href="/" theme="light" size="md" />

            <div className="hidden items-center gap-1 rounded-full border border-zinc-200 p-0.5 md:flex">
              <Link
                href="/employer"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  pathname?.startsWith("/employer")
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Employers
              </Link>
              <Link
                href="/worker"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  pathname?.startsWith("/worker")
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Workers
              </Link>
            </div>

            <nav className="hidden items-center gap-5 text-[11px] font-bold uppercase tracking-wide text-zinc-600 lg:flex">
              <Link className="hover:text-zinc-900" href="/#platform">
                Platform
              </Link>
              <Link className="hover:text-zinc-900" href="/#how-we-help">
                How we help
              </Link>
              <Link className="hover:text-zinc-900" href="/employer">
                Who we serve
              </Link>
              <Link className="hover:text-zinc-900" href="/#resources">
                Resources
              </Link>
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/worker/login"
                className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
              >
                Login
              </Link>
              <Link
                href="/employer/signup"
                className="px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
              >
                Signup
              </Link>
              <Link
                href="/employer"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Post a Shift
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-zinc-100 bg-white px-4 py-4 lg:hidden">
              <div className="mb-4 flex gap-1 rounded-full border border-zinc-200 p-0.5">
                <Link href="/employer" className="flex-1 rounded-full bg-zinc-900 py-2 text-center text-xs font-semibold text-white" onClick={() => setMenuOpen(false)}>
                  Employers
                </Link>
                <Link href="/worker" className="flex-1 rounded-full py-2 text-center text-xs font-semibold text-zinc-600" onClick={() => setMenuOpen(false)}>
                  Workers
                </Link>
              </div>
              <nav className="flex flex-col gap-3 text-[11px] font-bold uppercase tracking-wide text-zinc-700">
                <Link href="/#platform" onClick={() => setMenuOpen(false)}>Platform</Link>
                <Link href="/#how-we-help" onClick={() => setMenuOpen(false)}>How we help</Link>
                <Link href="/employer" onClick={() => setMenuOpen(false)}>Who we serve</Link>
                <Link href="/#resources" onClick={() => setMenuOpen(false)}>Resources</Link>
                <hr className="border-zinc-100" />
                <Link href="/worker/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/employer/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
                <Link href="/employer" className="rounded-lg bg-zinc-900 py-2.5 text-center font-semibold text-white" onClick={() => setMenuOpen(false)}>
                  Post a Shift
                </Link>
              </nav>
            </div>
          )}
        </header>
      )}

      {children}

      {!hideFooter && (
        <footer className="mt-auto border-t-2 border-[#1db954] bg-[#0f1115] text-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-16">
            <MyHireditoLogo href="/" theme="dark" size="md" />
            <p className="mt-2 text-sm text-zinc-400">
              The workforce platform for staffing.
            </p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <div className="text-sm font-bold text-white">Products</div>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <Link className="block hover:text-white" href="/worker/jobs">The Marketplace</Link>
                  <Link className="block hover:text-white" href="/employer">Jobs</Link>
                  <Link className="block hover:text-white" href="#">Pay</Link>
                  <Link className="block hover:text-white" href="#">Compliance</Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">By Size</div>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <Link className="block hover:text-white" href="/employer">SMB</Link>
                  <Link className="block hover:text-white" href="/employer">Multi-Unit</Link>
                  <Link className="block hover:text-white" href="/employer/signup">Enterprise</Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Company</div>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <Link className="block hover:text-white" href="#">About</Link>
                  <Link className="block hover:text-white" href="#">Careers</Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Browse by Pros</div>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <Link className="block hover:text-white" href="/worker/jobs">View All</Link>
                  <Link className="block hover:text-white" href="/worker/jobs">Healthcare</Link>
                  <Link className="block hover:text-white" href="/worker/jobs">By State</Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Resources</div>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <Link className="block hover:text-white" href="#">Blog</Link>
                  <Link className="block hover:text-white" href="#">Case Studies</Link>
                  <Link className="block hover:text-white" href="#">Help Center</Link>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} MyHiredito Inc. All rights reserved.</div>
              <div className="flex flex-wrap gap-4">
                <Link className="hover:text-white" href="#">Privacy Policy</Link>
                <Link className="hover:text-white" href="#">Terms of Use</Link>
                <Link className="hover:text-white" href="#">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
