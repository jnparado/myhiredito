"use client";

import Link from "next/link";

type MenuItem = {
  href: string;
  label: string;
  icon: "profile" | "edit" | "users";
  onClick?: () => void;
};

type Props = {
  displayName: string;
  email: string;
  roleLabel: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSignOut: () => void;
  items?: MenuItem[];
  manageAccountsHref?: string;
  manageAccountsLabel?: string;
  variant?: "default" | "employer";
  companyName?: string;
};

function MenuIcon({ type }: { type: MenuItem["icon"] | "sign-out" }) {
  const cls = "h-4 w-4 shrink-0";
  switch (type) {
    case "profile":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case "edit":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      );
    case "users":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    case "sign-out":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      );
  }
}

function AvatarBadge({
  initial,
  variant = "default",
}: {
  initial: string;
  variant?: "default" | "employer";
}) {
  if (variant === "employer") {
    return (
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1db954] text-sm font-black text-[#062510] shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]">
        {initial}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#0f1115] ring-2 ring-[#1db954]" />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
      {initial}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-white/70 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.25}
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export function ProfileDropdownMenu({
  displayName,
  email,
  roleLabel,
  open,
  onToggle,
  onClose,
  onSignOut,
  items,
  manageAccountsHref,
  manageAccountsLabel = "Manage User Accounts",
  variant = "default",
  companyName,
}: Props) {
  const initial = displayName.charAt(0).toUpperCase();
  const isEmployer = variant === "employer";

  const defaultItems: MenuItem[] = items ?? [
    { href: "#", label: "My Profile", icon: "profile" },
    { href: "#", label: "Edit Profile", icon: "edit" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={
          isEmployer
            ? `flex max-w-[13.5rem] items-center gap-2 rounded-2xl border py-1 pl-1 pr-2.5 transition sm:max-w-[16rem] ${
                open
                  ? "border-[#1db954]/70 bg-[#14181d]"
                  : "border-white/15 bg-[#181c22] hover:border-[#1db954]/50 hover:bg-[#1c2128]"
              }`
            : `flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition sm:px-3 ${
                open
                  ? "border-white/40 bg-white/10"
                  : "border-white/25 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`
        }
        aria-label="Account menu"
        aria-expanded={open}
      >
        <AvatarBadge initial={initial} variant={variant} />
        <div className="hidden min-w-0 text-left sm:block">
          <p
            className={`truncate leading-tight text-white ${
              isEmployer ? "text-[13px] font-bold tracking-tight" : "text-sm font-semibold"
            }`}
          >
            {displayName}
          </p>
          <p
            className={
              isEmployer
                ? "truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#1db954]"
                : "truncate text-[11px] text-white/60"
            }
          >
            {roleLabel}
          </p>
        </div>
        {isEmployer && <Chevron open={open} />}
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full z-50 mt-2 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden bg-white py-1 text-zinc-900 shadow-xl sm:w-64 ${
            isEmployer
              ? "rounded-2xl border border-zinc-200 shadow-[0_12px_40px_rgba(15,17,21,0.18)]"
              : "rounded-xl border border-zinc-200"
          }`}
        >
          {isEmployer && <div className="h-1 bg-[#1db954]" />}
          <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3.5">
            <AvatarBadge initial={initial} variant={variant} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-zinc-900">{displayName}</p>
              {isEmployer ? (
                <>
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#1db954]">
                    Employer
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {companyName || email}
                  </p>
                </>
              ) : (
                <p className="truncate text-xs text-zinc-500">{email}</p>
              )}
            </div>
          </div>

          {defaultItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
            >
              <MenuIcon type={item.icon} />
              {item.label}
            </Link>
          ))}

          {manageAccountsHref && (
            <Link
              href={manageAccountsHref}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
            >
              <MenuIcon type="users" />
              {manageAccountsLabel}
            </Link>
          )}

          <div className="my-1 border-t border-zinc-100" />

          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <MenuIcon type="sign-out" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
