import Link from "next/link";

export const metadata = {
  title: "Worker | MyHiredito",
  description: "Find jobs and manage your work on MyHiredito.",
};

export default function WorkerPage() {
  return (
    <main className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
            Worker
          </div>

          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            Discover opportunities that match your skills.
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Browse job posts, apply quickly, and track your applications. (This
            page is a starter—ready for your real worker/job features next.)
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
            >
              Browse jobs
            </Link>
            <Link
              href="/freelancer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:hover:bg-white/5 dark:focus-visible:ring-offset-black"
            >
              Hire freelancers
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

