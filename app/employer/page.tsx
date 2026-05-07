import Link from "next/link";

export const metadata = {
  title: "Employer | MyHiredito",
  description: "Hire freelancers and manage your hiring on MyHiredito.",
};

export default function EmployerPage() {
  return (
    <main className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
            Employer
          </div>

          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            Hire the right freelancer, faster.
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Post jobs, review applicants, and manage hiring from one dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/employer/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)]"
            >
              Sign up
            </Link>
            <Link
              href="/employer/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:hover:bg-white/5"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

