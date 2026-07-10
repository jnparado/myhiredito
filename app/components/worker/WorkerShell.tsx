"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MyHireditoLogo } from "@/app/components/brand/MyHireditoLogo";
import { getWorkerDisplayName, type WorkerAuthUser } from "@/app/lib/workerAuth";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import { useMessages } from "@/app/hooks/useMessages";
import {
  getIncompleteOnboardingSteps,
  getOnboardingCompletionCount,
  isOnboardingComplete,
} from "@/app/lib/workerOnboarding";
import { NotificationPanel } from "./NotificationPanel";
import { FloatingMessagingWidget } from "./FloatingMessagingWidget";

type OpenPanel = "notifications" | "more" | null;

const desktopNavItems = [
  { href: "/worker/jobs", label: "Browse", icon: "browse" },
  { href: "/worker/dashboard", label: "Home", icon: "home" },
  { href: "/worker/connect", label: "Circle", icon: "connect" },
  { href: "/worker/dashboard#applications", label: "Applications", icon: "applications" },
  { href: "/worker/messages", label: "Messages", icon: "messages" },
  { href: "/worker/onboarding/profile", label: "Profile", icon: "profile" },
];

const mobileNavItems = [
  { href: "/worker/dashboard", label: "Home", icon: "home" },
  { href: "/worker/jobs", label: "Browse", icon: "browse" },
  { href: "/worker/connect", label: "Circle", icon: "connect" },
  { href: "/worker/messages", label: "Messages", icon: "messages" },
  { href: "/worker/onboarding/profile", label: "Profile", icon: "profile" },
];

function NavIcon({ type }: { type: string }) {
  const cls = "h-5 w-5";
  switch (type) {
    case "browse":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      );
    case "applications":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006a2.18 2.18 0 01-.75 1.661m-4.5 0a2.18 2.18 0 01-.75-1.661m4.5 0V6.75a2.25 2.25 0 00-2.25-2.25h-2.25a2.25 2.25 0 00-2.25 2.25v6.378a2.18 2.18 0 01-.75 1.661" />
        </svg>
      );
    case "messages":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      );
    case "profile":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case "home":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "connect":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.006 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66c.253-.96.584-1.892.985-2.783.247-.55.006-1.21-.463-1.511l-.657-.38c-.551-.318-1.26-.117-1.527.461a20.89 20.89 0 00-1.44 4.282m3.102-.069a18.03 18.03 0 00.59 4.59c0 1.586-.205 3.124-.59 4.59m0 0a23.848 23.848 0 018.835-2.535" />
        </svg>
      );
  }
}

function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/worker/dashboard") return pathname === "/worker/dashboard";
  if (href.includes("#")) return false;
  return pathname.startsWith(href);
}

export function WorkerShell({
  children,
  user: userProp,
}: {
  children: React.ReactNode;
  user?: WorkerAuthUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: sessionUser, signOut } = useWorkerAuth();
  const { progress, loading: onboardingLoading } = useWorkerOnboarding();
  const { unreadCount: unreadMessages } = useMessages();
  const user = userProp ?? sessionUser;
  const displayName = user ? getWorkerDisplayName(user) : "Worker";
  const onboardingIncomplete =
    !onboardingLoading && user && !isOnboardingComplete(progress);
  const incompleteSteps = getIncompleteOnboardingSteps(progress);
  const { completed, total } = getOnboardingCompletionCount(progress);
  const nextOnboardingStep = incompleteSteps[0];
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const headerMenusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerMenusRef.current &&
        !headerMenusRef.current.contains(event.target as Node)
      ) {
        setOpenPanel(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function togglePanel(panel: Exclude<OpenPanel, null>) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  async function handleSignOut() {
    setOpenPanel(null);
    await signOut();
    router.push("/worker/login");
    router.refresh();
  }

  const notificationCount =
    (onboardingIncomplete ? 1 : 0) + unreadMessages;

  function openMessagingPopup() {
    window.dispatchEvent(new Event("myhiredito-open-messaging"));
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <header className="sticky top-0 z-40 border-b border-[#1db954]/30 bg-[#0f1115] text-white">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 lg:px-6">
          <MyHireditoLogo href="/worker" theme="dark" size="md" />

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex lg:gap-4">
            {desktopNavItems.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex shrink-0 flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition ${
                    active ? "text-white" : "text-white/60 hover:text-white/90"
                  }`}
                >
                  <NavIcon type={item.icon} />
                  <span
                    className={
                      active ? "border-b-2 border-[var(--brand)] pb-0.5" : ""
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            ref={headerMenusRef}
            className="relative ml-auto flex shrink-0 items-center gap-1 sm:gap-2"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("notifications")}
                className={`relative rounded-md p-1.5 transition ${
                  openPanel === "notifications"
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white"
                }`}
                aria-label="Notifications"
                aria-expanded={openPanel === "notifications"}
              >
                {notificationCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-[#2b2b2b]">
                    {notificationCount}
                  </span>
                )}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {openPanel === "notifications" && (
                <NotificationPanel
                  unreadMessages={unreadMessages}
                  onboardingIncomplete={!!onboardingIncomplete}
                  nextStep={nextOnboardingStep}
                  completed={completed}
                  total={total}
                  onClose={() => setOpenPanel(null)}
                  onOpenMessages={openMessagingPopup}
                />
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("more")}
                className={`rounded-md p-1.5 transition ${
                  openPanel === "more"
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white"
                }`}
                aria-label="More options"
                aria-expanded={openPanel === "more"}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {openPanel === "more" && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(14rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 text-zinc-900 shadow-xl sm:w-56">
                  <div className="border-b border-zinc-100 px-4 py-3">
                    <p className="truncate text-sm font-bold text-zinc-900">{displayName}</p>
                    <p className="text-xs text-zinc-500">
                      Worker account
                    </p>
                  </div>
                  <Link
                    href="/worker/dashboard"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/worker/dashboard#applications"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50 lg:hidden"
                  >
                    Applications
                  </Link>
                  <Link
                    href="/worker/onboarding/profile"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    My profile
                  </Link>
                  <Link
                    href="/worker/messages"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Messages
                    {unreadMessages > 0 && (
                      <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/worker/jobs"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Browse jobs
                  </Link>
                  {onboardingIncomplete && (
                    <Link
                      href={nextOnboardingStep?.href ?? "/worker/dashboard"}
                      onClick={() => setOpenPanel(null)}
                      className="block px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Finish onboarding
                    </Link>
                  )}
                  <div className="my-1 border-t border-zinc-100" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/worker/dashboard"
              className="relative hidden items-center gap-2 border-l border-white/20 pl-3 md:flex"
              title="Go to dashboard"
            >
              <div className="hidden text-right sm:block">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="max-w-[8rem] truncate text-xs font-semibold leading-tight">
                    {displayName}
                  </span>
                  {onboardingIncomplete && (
                    <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Incomplete
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-white/60">
                  MyHiredito
                </div>
              </div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                {onboardingIncomplete && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#2b2b2b]" />
                )}
                {displayName.charAt(0)}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-[calc(9rem+env(safe-area-inset-bottom,0px))] lg:pb-14">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden"
        aria-label="Worker navigation"
      >
        <div className="grid grid-cols-5">
          {mobileNavItems.map((item) => {
            const active = isNavActive(pathname, item.href);
            const showBadge =
              item.icon === "messages" && unreadMessages > 0;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-semibold transition ${
                  active
                    ? "text-[var(--brand)]"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <span className="relative">
                  <NavIcon type={item.icon} />
                  {showBadge && (
                    <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold text-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                  {item.icon === "profile" && onboardingIncomplete && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <FloatingMessagingWidget />
    </div>
  );
}
