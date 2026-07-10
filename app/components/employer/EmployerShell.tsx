"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MyHireditoLogo } from "@/app/components/brand/MyHireditoLogo";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerOnboarding } from "@/app/hooks/useEmployerOnboarding";
import {
  getEmployerCompanyName,
  getEmployerDisplayName,
  type EmployerAuthUser,
} from "@/app/lib/employerAuth";

const navItems = [
  { href: "/employer/dashboard?post=1", label: "Post Job", icon: "post" },
  { href: "/employer/dashboard", label: "Home", icon: "home" },
  { href: "#", label: "Applicants", icon: "applicants" },
  { href: "#", label: "Workers", icon: "workers" },
  { href: "#", label: "Billing", icon: "billing" },
  { href: "#", label: "Reports", icon: "reports" },
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
  const { needsAttention: onboardingIncomplete } = useEmployerOnboarding();
  const user = userProp ?? sessionUser;
  const displayName = user ? getEmployerDisplayName(user) : "Employer";
  const companyName = user ? getEmployerCompanyName(user) : "MyHiredito";
  const isDemo = user?.source === "demo";

  async function handleSignOut() {
    await signOut();
    router.push("/employer/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
      <header className="bg-[#0f1115] text-white">
        <div className="flex items-center justify-between border-b-2 border-[#1db954] px-4 py-2.5 lg:px-6">
          <MyHireditoLogo href="/" theme="dark" size="md" />

          <nav className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2 lg:gap-4">
            {navItems.map((item) => {
              const active =
                item.href === "/employer/dashboard"
                  ? pathname === "/employer/dashboard"
                  : pathname?.startsWith(item.href) && item.href !== "#";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex shrink-0 flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition sm:px-3 sm:text-xs ${
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
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative text-white/70 hover:text-white"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {onboardingIncomplete && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0f1115]" />
              )}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden items-center gap-2 border-l border-white/20 pl-3 sm:flex"
              title="Sign out"
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
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
