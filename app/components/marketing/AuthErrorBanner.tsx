"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("auth") !== "error") return null;

  return (
    <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
      Sign-in could not be completed. Please try again or use a demo account.{" "}
      <Link href="/worker/login" className="font-semibold underline">
        Worker login
      </Link>
      {" · "}
      <Link href="/employer/login" className="font-semibold underline">
        Employer login
      </Link>
    </div>
  );
}
