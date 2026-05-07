import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_20%_0%,rgba(59,130,246,.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(20,184,166,.14),transparent_55%)]" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm dark:border-white/10 dark:bg-black dark:text-zinc-200">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
              Hire faster. Work smarter.
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              Recruit the talent you need — without the stress.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              MyHiredito helps businesses hire vetted freelancers and helps
              professionals find quality work opportunities in one friendly
              platform.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/freelancer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
              >
                Find a freelancer
              </Link>
              <Link
                href="/worker"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:hover:bg-white/5"
              >
                Find jobs
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/70" />
                Verified profiles
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/70" />
                Secure payments
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/70" />
                Easy messaging
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
              <div className="grid gap-4">
                <div className="rounded-2xl bg-[var(--surface-2)] p-5 dark:bg-white/5">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    New job offer
                  </div>
                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    “Hi! Can we discuss your project timeline and deliverables?”
                  </div>
                </div>
                <div className="rounded-2xl bg-[var(--surface-2)] p-5 dark:bg-white/5">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Payment released
                  </div>
                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    You received <span className="font-semibold">$500</span> for
                    milestone completion.
                  </div>
                </div>
                <div className="rounded-2xl bg-[var(--surface-2)] p-5 dark:bg-white/5">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Recommended freelancers
                  </div>
                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Based on your role, we matched top candidates in minutes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16 dark:bg-black">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
            Find top talent by category
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Browse popular categories and connect with people who can deliver.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Web, Mobile & Software",
                desc: "Build apps and ship features with confidence.",
              },
              {
                title: "Design & Creative",
                desc: "UI/UX, branding, illustration, and more.",
              },
              { title: "Writing", desc: "Copywriting, blogs, and technical docs." },
              { title: "Sales", desc: "Prospecting, outreach, and account support." },
              { title: "Admin Support", desc: "Organize, research, and keep things moving." },
              {
                title: "Customer Service",
                desc: "Support teams that customers actually love.",
              },
            ].map((c) => (
              <Link
                key={c.title}
                href="/freelancer"
                className="group rounded-2xl border border-black/10 bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-black/15 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:focus-visible:ring-offset-black"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      {c.title}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {c.desc}
                    </div>
                  </div>
                  <div className="mt-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--brand)] ring-1 ring-black/10 group-hover:bg-[var(--brand)] group-hover:text-white group-hover:ring-transparent dark:bg-black dark:ring-white/10">
                    Browse
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--surface)] py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
            People love working with MyHiredito
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                quote:
                  "MyHiredito helped us hire quickly without sacrificing quality.",
                name: "James",
                role: "Founder",
              },
              {
                quote:
                  "We found reliable freelancers that felt like part of our team.",
                name: "Stephanie",
                role: "CEO",
              },
              {
                quote:
                  "If you want a smoother hiring experience, I recommend MyHiredito.",
                name: "Anna",
                role: "CEO",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black"
              >
                <div className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                  “{t.quote}”
                </div>
                <div className="mt-4 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {t.name}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
