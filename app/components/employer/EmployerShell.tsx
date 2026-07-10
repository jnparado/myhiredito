"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MyHireditoLogo } from "@/app/components/brand/MyHireditoLogo";
import { useEmployerApplicants } from "@/app/hooks/useEmployerApplicants";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerMessages } from "@/app/hooks/useEmployerMessages";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import {
  getEmployerCompanyName,
  getEmployerDisplayName,
  type EmployerAuthUser,
} from "@/app/lib/employerAuth";
import {
  getIncompleteOnboardingSteps,
  getOnboardingCompletionCount,
} from "@/app/lib/employerOnboarding";
import { EmployerFloatingMessagingWidget } from "./EmployerFloatingMessagingWidget";
import { EmployerNotificationPanel } from "./EmployerNotificationPanel";

type OpenPanel = "notifications" | "more" | null;

const navItems = [
  { href: "/employer/dashboard?post=1", label: "Post Job", icon: "post" },
  { href: "/employer/dashboard", label: "Home", icon: "home" },
  { href: "/employer/applicants", label: "Applicants", icon: "applicants" },
  { href: "/employer/messages", label: "Messages", icon: "messages" },
  { href: "/employer/workers", label: "Workers", icon: "workers" },
  { href: "/employer/billing", label: "Billing", icon: "billing" },
  { href: "/employer/reports", label: "Reports", icon: "reports" },
];

function NavIcon({ type }: { type: string }) {
  const cls = "h-5 w-5";
  switch (type) {
    case "post":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      );
    case "home":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "applicants":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    case "messages":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      );
    case "workers":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    case "billing":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
  }
}

export function EmployerShell({
  children,
  user: userProp,
}: {
  children: React.ReactNode;
  user?: EmployerAuthUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: sessionUser, signOut } = useEmployerAuth();
  const { needsAttention: onboardingIncomplete, progress } = useEmployerOnboarding();
  const { unreadCount: unreadMessages } = useEmployerMessages();
  const { newCount: newApplicants } = useEmployerApplicants();
  const user = userProp ?? sessionUser;
  const displayName = user ? getEmployerDisplayName(user) : "Employer";
  const companyName = user ? getEmployerCompanyName(user) : "MyHiredito";
  const isDemo = user?.source === "demo";
  const incompleteSteps = getIncompleteOnboardingSteps(progress);
  const nextOnboardingStep = incompleteSteps[0];
  const { completed, total } = getOnboardingCompletionCount(progress);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const headerMenusRef = useRef<HTMLDivElement>(null);

  const notificationCount =
    (onboardingIncomplete ? 1 : 0) + unreadMessages + newApplicants;

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
    router.push("/employer/login");
    router.refresh();
  }

  function openMessagingPopup() {
    window.dispatchEvent(new Event("myhiredito-employer-open-messaging"));
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
      <header className="bg-[#0f1115] text-white">
        <div className="flex items-center justify-between border-b-2 border-[#1db954] px-4 py-2.5 lg:px-6">
          <MyHireditoLogo href="/employer/dashboard" theme="dark" size="md" />

          <nav className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2 lg:gap-4">
            {navItems.map((item) => {
              const active =
                item.href === "/employer/dashboard"
                  ? pathname === "/employer/dashboard"
                  : item.href.startsWith("/employer/dashboard?")
                    ? pathname === "/employer/dashboard"
                    : pathname?.startsWith(item.href.split("?")[0]) &&
                      item.href !== "#";
              const showUnreadBadge =
                item.icon === "messages" && unreadMessages > 0;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative flex shrink-0 flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition sm:px-3 sm:text-xs ${
                    active ? "text-white" : "text-white/60 hover:text-white/90"
                  }`}
                >
                  <NavIcon type={item.icon} />
                  <span
                    className={
                      active ? "border-b-2 border-[#1db954] pb-0.5" : ""
                    }
                  >
                    {item.label}
                  </span>
                  {showUnreadBadge && (
                    <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div
            ref={headerMenusRef}
            className="relative flex shrink-0 items-center gap-1 sm:gap-2"
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
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-[#0f1115]">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {openPanel === "notifications" && (
                <EmployerNotificationPanel
                  unreadMessages={unreadMessages}
                  newApplicants={newApplicants}
                  onboardingIncomplete={onboardingIncomplete}
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
                    <p className="truncate text-xs text-zinc-500">
                      {isDemo ? companyName : "Employer account"}
                    </p>
                  </div>
                  <Link
                    href="/employer/dashboard"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/employer/profile"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    My profile
                  </Link>
                  <Link
                    href="/employer/applicants"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Applicants
                    {newApplicants > 0 && (
                      <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {newApplicants}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/employer/messages"
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
                    href="/employer/dashboard?post=1"
                    onClick={() => setOpenPanel(null)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Post a job
                  </Link>
                  {onboardingIncomplete && (
                    <Link
                      href={nextOnboardingStep?.href ?? "/employer/dashboard"}
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
              href="/employer/profile"
              className="relative hidden items-center gap-2 border-l border-white/20 pl-3 sm:flex"
              title="Go to profile"
            >
              <div className="text-right">
                <div className="text-xs font-semibold leading-tight">
                  {displayName}
                </div>
                <div className="max-w-[120px] truncate text-[10px] text-white/60">
                  {isDemo ? companyName : "Employer account"}
                </div>
              </div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                {displayName.charAt(0)}
                {onboardingIncomplete && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0f1115]" />
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-14">{children}</main>

      <EmployerFloatingMessagingWidget />
    </div>
  );
}
