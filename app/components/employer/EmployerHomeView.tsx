"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  authButtonClass,
  authFieldClass,
  authLabelClass,
} from "@/app/components/auth/AuthShell";
import { EmployerOnboardingAlert } from "./EmployerOnboardingAlert";
import { EmployerHomeRightRail } from "./EmployerHomeRightRail";
import { EmployerJobFeed } from "./EmployerJobFeed";
import {
  EmployerPostJobComposer,
  EmployerPostJobModal,
} from "./EmployerPostJobComposer";
import { EmployerProfileSidebar } from "./EmployerProfileSidebar";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { getEmployerUserKey } from "@/app/lib/employerOnboarding";
import {
  createHiringUpdate,
  createShiftFromForm,
} from "@/app/lib/employerActivity";

function ShiftModal({
  open,
  onClose,
  userKey,
}: {
  open: boolean;
  onClose: () => void;
  userKey: string | null;
}) {
  if (!open || !userKey) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createShiftFromForm(userKey!, new FormData(e.currentTarget));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-zinc-900">Add open shift</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className={authLabelClass}>Shift title</label>
            <input name="title" className={authFieldClass} placeholder="Evening CNA shift" required />
          </div>
          <div>
            <label className={authLabelClass}>Date</label>
            <input name="shiftDate" type="date" className={authFieldClass} required />
          </div>
          <div>
            <label className={authLabelClass}>Location</label>
            <input name="location" className={authFieldClass} required />
          </div>
          <div>
            <label className={authLabelClass}>Pay</label>
            <input name="pay" className={authFieldClass} placeholder="$26/hr" required />
          </div>
          <div>
            <label className={authLabelClass}>Notes</label>
            <textarea name="notes" rows={2} className={authFieldClass} />
          </div>
          <button type="submit" className={authButtonClass}>Post shift</button>
        </form>
      </div>
    </div>
  );
}

function UpdateModal({
  open,
  onClose,
  userKey,
}: {
  open: boolean;
  onClose: () => void;
  userKey: string | null;
}) {
  const [body, setBody] = useState("");
  if (!open || !userKey) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    createHiringUpdate(userKey!, body);
    setBody("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-zinc-900">Share hiring update</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className={authFieldClass}
            placeholder="We're hiring CNAs for weekend shifts..."
            required
          />
          <button type="submit" className={authButtonClass}>Post update</button>
        </form>
      </div>
    </div>
  );
}

export function EmployerHomeView() {
  const searchParams = useSearchParams();
  const { user } = useEmployerAuth();
  const userKey = getEmployerUserKey(user);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("post") === "1") setJobModalOpen(true);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-[1128px] px-3 py-4 sm:px-4 sm:py-6">
      <EmployerOnboardingAlert />

      <div className="grid gap-4 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
        <div className="hidden lg:block">
          <EmployerProfileSidebar />
        </div>

        <main className="min-w-0 space-y-2">
          <EmployerPostJobComposer
            onOpenModal={() => setJobModalOpen(true)}
            onOpenShift={() => setShiftModalOpen(true)}
            onOpenUpdate={() => setUpdateModalOpen(true)}
          />
          <EmployerJobFeed />
        </main>

        <div className="hidden lg:block">
          <EmployerHomeRightRail />
        </div>
      </div>

      <div className="mt-4 space-y-2 lg:hidden">
        <EmployerProfileSidebar />
        <EmployerHomeRightRail />
      </div>

      <EmployerPostJobModal
        open={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
      />
      <ShiftModal
        open={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        userKey={userKey}
      />
      <UpdateModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        userKey={userKey}
      />
    </div>
  );
}
