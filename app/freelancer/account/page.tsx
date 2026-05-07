import Link from "next/link";

export const metadata = {
  title: "Freelancer Account | MyHiredito",
  description: "Manage your freelancer profile on MyHiredito.",
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
      {children}
    </span>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-black">
      <div className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4 dark:border-white/10">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h2>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export default function FreelancerAccountPage() {
  const skills = ["Database Design", "Data Migration", "Assessments & Testing"];

  return (
    <main className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Chip>Freelancer account</Chip>
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
              Profile
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Keep your profile updated to get better matches.
            </p>
          </div>
          <Link
            href="/freelancer"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:hover:bg-white/5"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            <Section
              title="About"
              action={
                <button className="rounded-full px-3 py-1 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--surface-2)] dark:hover:bg-white/5">
                  Edit
                </button>
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-teal-300 text-base font-semibold text-white shadow-sm">
                    JD
                  </div>
                  <div>
                    <div className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      John Doe
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Chicago, America
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Web & Mobile Application Developer
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    I’m an experienced designer in UI/UX design, website design,
                    landing pages, logos, and dashboards. Feel free to contact
                    me if you have any project.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-500">
                        Hourly rate
                      </div>
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        $5.00
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-500">
                        Job success
                      </div>
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        96%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-500">
                        Earned
                      </div>
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        $15,656
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="Portfolio"
              action={
                <button className="rounded-full px-3 py-1 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--surface-2)] dark:hover:bg-white/5">
                  Add
                </button>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-black/10 bg-[var(--surface)] dark:border-white/10"
                  >
                    <div className="aspect-[16/10] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-white/5 dark:to-white/10" />
                    <div className="p-4">
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        Project {i}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Short description of the work.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-black dark:text-zinc-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>

            <Section
              title="Employment history"
              action={
                <button className="rounded-full px-3 py-1 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--surface-2)] dark:hover:bg-white/5">
                  Add
                </button>
              }
            >
              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Law Teacher | Stanford University
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  2017 — Present
                </div>
              </div>
            </Section>

            <Section
              title="Education"
              action={
                <button className="rounded-full px-3 py-1 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--surface-2)] dark:hover:bg-white/5">
                  Add
                </button>
              }
            >
              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Bachelor’s | Northwestern University
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  2020 — 2022
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Profile settings
                </div>
                <button className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--surface-2)] dark:hover:bg-white/5">
                  Edit
                </button>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="space-y-1">
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    Availability
                  </div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Online
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    As needed — open to offers
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    Profile link
                  </div>
                  <div className="rounded-xl border border-black/10 bg-[var(--surface)] px-3 py-2 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    myhiredito.com/freelancer/john-doe
                  </div>
                  <button className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-[var(--brand)] text-xs font-semibold text-white hover:bg-[var(--brand-strong)]">
                    Copy link
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Languages
              </div>
              <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>English</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Fluent
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Arabic</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Conversational
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

