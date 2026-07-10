import Link from "next/link";
import { MarketingNav } from "./MarketingNav";

function VisitCta({ className = "" }: { className?: string }) {
  return (
    <p className={`text-base leading-7 text-zinc-600 sm:text-lg ${className}`}>
      Visit{" "}
      <Link href="/worker/signup" className="font-semibold text-[var(--brand)] hover:underline">
        MyHiredito
      </Link>
      , get verified, and start applying to jobs that fit your skills.
    </p>
  );
}

export function WorkersLandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section>
        <MarketingNav />
        <div className="bg-zinc-50">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-4 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-28 lg:pt-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
                Built for flexible workers
              </p>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Flexible work.
                <br />
                Fair pay.
                <br />
                Your schedule.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-zinc-600">
                MyHiredito connects you with open roles at healthcare sites,
                restaurants, warehouses, and event venues — with verified pay
                rates, clear requirements, and a profile that grows with every
                job you complete.
              </p>
              <p className="mt-4 text-sm text-zinc-500">
                CNA · RN · Warehouse · Events · Food Service · 30+ categories
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand-light)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                Smart job matching
              </div>
              <div className="mt-8">
                <VisitCta />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/worker/signup"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--brand)] px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[var(--brand-strong)]"
                >
                  Create Profile
                </Link>
                <Link
                  href="/worker/jobs"
                  className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-zinc-900 px-8 text-sm font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg sm:aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/workers-hero.png"
                  alt="MyHiredito workers ready for their next role"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute -left-2 bottom-16 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-lg sm:left-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-lg font-black">4.8</span>
                  <span>★★★★★</span>
                </div>
                <div className="text-xs text-zinc-500">Verified worker rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
            Verified work history
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Your profile shows what you can do — not just what you claim.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            Every completed role, rating, and certification is stored on your
            MyHiredito profile. Employers see real performance data before they
            invite you, so strong workers get noticed faster.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Choose your opportunities",
                desc: "Apply to full-time, part-time, or contract roles that fit your week. Work occasionally or build toward steady hours — there are no minimum requirements.",
              },
              {
                title: "Grow your profile",
                desc: "Skills, certifications, and reliability scores update automatically as you complete more roles.",
              },
              {
                title: "Get paid quickly",
                desc: "Track earnings after each job and receive direct deposit payouts without waiting for a biweekly cycle.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-light)] text-sm font-bold text-[var(--brand)]">
                  ✓
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-zinc-100 bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            How it works for workers
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Create your profile",
                desc: "Sign up on MyHiredito and tell us your skills, availability, and preferred locations.",
              },
              {
                step: "2",
                title: "Complete verification",
                desc: "Upload ID, pass background screening, and add any licenses or certifications.",
              },
              {
                step: "3",
                title: "Apply to matched jobs",
                desc: "Once verification is complete, browse roles suited to your skills and experience — then apply to the jobs you want.",
              },
              {
                step: "4",
                title: "Get hired and build your record",
                desc: "Interview, start the role, get paid, and grow your verified work history on MyHiredito.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-bold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
                Worker dashboard
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                See nearby jobs, pay, and details in one place.
              </h2>
              <p className="mt-4 text-zinc-600">
                MyHiredito shows open roles ranked by fit, distance, and pay so
                you can make informed decisions. Review requirements, submit
                applications, and track what you&apos;ve earned — all from your
                dashboard.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Job list filtered by role and distance",
                  "Upfront pay range and role requirements",
                  "Application status and interview updates",
                  "Full-time offers from employers you already know",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-700">
                    <span className="mt-0.5 text-[var(--brand)]">●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/myhiredito-shift-board.png"
                alt="MyHiredito jobs dashboard preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-light)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-dark)]">
                Career growth
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                Gig work can become long-term opportunities.
              </h2>
              <p className="mt-4 text-zinc-700">
                Many workers use MyHiredito to try employers before committing
                full time. When a business wants to hire you permanently, there
                is no worker placement fee.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/60 bg-white p-6">
                  <div className="text-4xl font-black text-[var(--brand)]">38%</div>
                  <p className="mt-2 text-sm text-zinc-600">
                    of active workers receive repeat invitations
                  </p>
                </div>
                <div className="rounded-xl border border-white/60 bg-white p-6">
                  <div className="text-4xl font-black text-[var(--brand)]">$0</div>
                  <p className="mt-2 text-sm text-zinc-600">
                    worker fees when converting to full-time
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Healthcare", roles: "CNA, RN, Home Health, Aide" },
                { title: "Logistics", roles: "Warehouse, Picker, Loader, Driver" },
                { title: "Hospitality", roles: "Server, Host, Cook, Bartender" },
                { title: "Events", roles: "Setup, Captain, Coordinator, Staff" },
              ].map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-xl border border-white/60 bg-white p-5"
                >
                  <h3 className="font-bold text-zinc-900">{cat.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{cat.roles}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
            Community voices
          </p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
            Workers using MyHiredito today
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "I applied to CNA roles around nursing school and landed a part-time job that fits my schedule.",
                name: "Priya",
                role: "CNA · San Antonio, TX",
              },
              {
                quote: "My profile made it easy to move from weekend warehouse gigs into a steady supervisor role.",
                name: "Marcus",
                role: "Warehouse Lead · Chicago, IL",
              },
              {
                quote: "I like seeing the pay and requirements before I apply. No surprises when I interview.",
                name: "Jordan",
                role: "Event Staff · Atlanta, GA",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="text-amber-400">★★★★★</div>
                <p className="mt-4 text-sm leading-7 text-zinc-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 text-sm font-bold text-zinc-900">{t.name}</div>
                <div className="text-xs text-zinc-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-zinc-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold text-zinc-900">
            Questions workers ask
          </h2>
          <div className="mt-10 space-y-4">
            {[
              {
                q: "How do I get started?",
                a: "Create a free MyHiredito profile, complete verification, and start applying to jobs in your area.",
              },
              {
                q: "What does verification include?",
                a: "Identity confirmation, background screening, and any role-specific credentials you choose to add.",
              },
              {
                q: "When do I get paid?",
                a: "Earnings are tracked per role and paid by direct deposit based on the employer's payout schedule.",
              },
              {
                q: "Can I work in more than one category?",
                a: "Yes. Add multiple skills to your profile and apply to jobs across healthcare, hospitality, events, and more.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-zinc-200 bg-white"
              >
                <summary className="cursor-pointer px-6 py-4 font-bold text-zinc-900">
                  {item.q}
                </summary>
                <p className="border-t border-zinc-100 px-6 py-4 text-sm leading-7 text-zinc-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-[var(--brand-light)] py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            Ready to find your next job?
          </h2>
          <div className="mt-6">
            <VisitCta />
          </div>
          <Link
            href="/worker/signup"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--brand)] px-10 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[var(--brand-strong)]"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
