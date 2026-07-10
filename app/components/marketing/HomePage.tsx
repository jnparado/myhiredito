import Link from "next/link";
import { InstantBookingSection } from "./InstantBookingSection";
import { MarketingNav } from "./MarketingNav";

export function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section>
        <MarketingNav />
        <div className="bg-[#0f1115]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-4 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-24 lg:pt-12">
          <div>
            <p className="text-sm font-medium text-zinc-400">
              Staffing software for modern teams
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Staff smarter.
              <br />
              Hire faster.
              <br />
              Stay compliant.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
              MyHiredito helps employers post shifts, match verified workers,
              manage schedules, and run payroll — without juggling five
              different tools.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              One platform for staffing operations
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/employer"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
              >
                Post a Shift
              </Link>
              <Link
                href="/worker/jobs"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                Find Work
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl sm:aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/employers-hero.png"
                alt="Employer team managing staffing on MyHiredito"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b-2 border-[#1db954] bg-zinc-50 py-8">
        <p className="text-center text-sm font-medium text-zinc-600">
          Join the thousands of businesses nationwide that trust and use{" "}
          <span className="font-bold text-zinc-900">MyHiredito</span>
        </p>
      </section>

      <InstantBookingSection />

      {/* Platform */}
      <section id="platform" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand)]">
            The platform
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Every shift filled. Every worker paid.
            <br />
            Every rule followed.
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Four products, one platform. Start anywhere, expand from there.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {[
              {
                tag: "The Marketplace",
                title: "Your Talent Network",
                desc: "Staffing's largest talent network. Build your bench with intelligent matching trained on 2.5M+ real shifts.",
                features: [
                  "Intelligent matching",
                  "Build your bench",
                  "Clock-in / Clock-out",
                  "Messaging",
                  "Templates & rosters",
                  "Ratings & reviews",
                ],
                cta: "Browse local talent →",
                href: "/worker/jobs",
              },
              {
                tag: "Shift Posting",
                title: "Cover Open Roles Fast",
                desc: "Publish shift needs, set pay and requirements, and invite qualified workers from your market.",
                features: [
                  "No contracts, no minimums",
                  "Best-fit pro matched in under 30 minutes",
                  "Only pay when shifts are filled",
                  "35+ roles available",
                  "GPS-verified clock-in",
                  "Same-day coverage",
                ],
                cta: "Book a shift →",
                href: "/employer",
              },
              {
                tag: "Jobs",
                title: "Hire with Confidence",
                desc: "Candidates are ranked using real shift data — not resumes — so you find, trial, and convert the right people.",
                features: [
                  "Paid working interviews",
                  "AI-scored candidate profiles",
                  "Conversion fee drops to $0 at 300 hours",
                  "Try before you hire",
                ],
                cta: "Learn more →",
                href: "/employer",
              },
              {
                tag: "Pay",
                title: "Pay Made Simple",
                desc: "Multi-state payroll for W-2 and 1099 workers. Every payment is checked for compliance automatically.",
                features: [
                  "W-2 and 1099 payroll, 50 states",
                  "Instant pay after shift completion",
                  "Tax compliance handled for you",
                ],
                cta: "Explore Pay →",
                href: "#",
              },
            ].map((product) => (
              <div
                key={product.title}
                className="rounded-2xl border border-zinc-200 p-8 transition hover:border-[var(--brand)]/40 hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                  {product.tag}
                </p>
                <h3 className="mt-2 text-xl font-bold text-zinc-900">
                  {product.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {product.desc}
                </p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-700"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={product.href}
                  className="mt-6 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  {product.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to start */}
      <section id="how-we-help" className="border-y border-zinc-100 bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-zinc-900">
            What do you need help with?
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Whether you are covering one open shift or building a staffing plan
            across multiple locations, MyHiredito has a path that fits.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "I need to fill a shift — fast",
                desc: "Same-day or this week. One role or a few.",
                href: "/employer",
              },
              {
                title: "I need ongoing, reliable coverage",
                desc: "Recurring shifts, a bench of favorites, templates.",
                href: "/employer",
              },
              {
                title: "I want to hire full-time from my pipeline",
                desc: "Try before you hire. Fee drops to $0.",
                href: "/employer",
              },
              {
                title: "I run a national operation and need it all",
                desc: "Compliance, payroll, hiring — at scale.",
                href: "/employer/signup",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-[var(--brand)] hover:shadow-md"
              >
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[var(--brand)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{card.desc}</p>
                <span className="mt-4 inline-block text-sm text-[var(--brand)]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand)]">
            Automation built in
          </p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
            Less manual work for your ops team.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-600">
            MyHiredito automates matching, screening, scheduling support, and
            common admin tasks so your managers can focus on running the floor.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Match",
                title: "Fill open shifts faster",
                desc: "Surface qualified workers based on skills, distance, and past performance.",
              },
              {
                name: "Screen",
                title: "Review candidates quickly",
                desc: "Collect credentials and screening results before anyone is approved to work.",
              },
              {
                name: "Plan",
                title: "Stay ahead of coverage gaps",
                desc: "See upcoming staffing needs and spot unfilled roles before they become problems.",
              },
              {
                name: "Assist",
                title: "Resolve shift issues",
                desc: "Handle common questions and escalations without tying up your managers.",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="rounded-xl border border-zinc-200 p-6"
              >
                <div className="text-lg font-bold text-[var(--brand)]">
                  {agent.name}
                </div>
                <h3 className="mt-2 font-bold text-zinc-900">{agent.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {agent.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vetted pros */}
      <section className="bg-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Every pro on MyHiredito is verified before their first shift.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            We don&apos;t just match anyone. Every professional passes identity
            verification, background checks, and AI-powered skills assessment.
            The result: a 95% fill rate and a 4.8★ average pro rating.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Identity Verified", desc: "Government ID check on every professional" },
              { title: "Background Checked", desc: "Comprehensive screening before first shift" },
              { title: "Skills Assessed", desc: "Role-specific evaluation and certification" },
              { title: "Continuously Rated", desc: "Two-way ratings after every shift" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See it in action — mock dashboards */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-zinc-900">
            One platform. Every workflow.
          </h2>
          <p className="mt-3 text-zinc-600">
            From shift posting to payroll closeout — here&apos;s what your team
            sees every day.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <MockPanel title="Schedule — Week of Jul 14">
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold text-zinc-500">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { role: "CNA", names: ["Jordan R.", "Alex M.", "Open", "Sam K.", "Kim L."] },
                  { role: "RN", names: ["Maya T.", "Chris P.", "Maya T.", "Open", "Maya T."] },
                ].map((row) => (
                  <div key={row.role} className="grid grid-cols-6 gap-2 text-xs">
                    <div className="font-semibold text-zinc-700">{row.role}</div>
                    {row.names.map((n, i) => (
                      <div
                        key={i}
                        className={`rounded px-1 py-1.5 text-center ${
                          n === "Open"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-[var(--brand-light)] text-[var(--brand-dark)]"
                        }`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </MockPanel>
            <MockPanel title="Live Shift Tracker — Friday 6pm">
              <div className="space-y-3">
                {[
                  { name: "Jordan R. · CNA", status: "Clocked in 5:52pm", ok: true },
                  { name: "Maya T. · RN", status: "Clocked in 5:48pm", ok: true },
                  { name: "Kim L. · Home Health", status: "En route — ETA 6:04pm", ok: false },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm">
                    <div>
                      <div className="font-semibold text-zinc-900">{s.name}</div>
                      <div className="text-zinc-500">{s.status}</div>
                    </div>
                    {s.ok && (
                      <span className="rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-xs font-bold text-[var(--brand)]">
                        GPS ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs font-medium text-[var(--brand)]">
                3/3 shifts covered · No gaps detected
              </p>
            </MockPanel>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { value: "350K+", label: "Verified Pros" },
            { value: "2.5M+", label: "Shifts Filled" },
            { value: "95%", label: "Fill Rate" },
            { value: "30 min", label: "Avg Fill Time" },
            { value: "42", label: "States" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-zinc-900 lg:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-zinc-900">
            From posting to payment, handled automatically.
          </h2>
          <p className="mt-3 text-zinc-600">
            Here&apos;s what your Friday night looks like with MyHiredito.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { time: "Friday 4:00 PM", step: "1", title: "Post your shift", desc: "Select the role, hours, and requirements. Under a minute." },
              { time: "Friday 4:30 PM", step: "2", title: "You're matched", desc: "Best-fit pros found using skills, ratings, and proximity." },
              { time: "Friday 6:00 PM", step: "3", title: "They show up", desc: "GPS-verified clock-in, real-time tracking, automated alerts." },
              { time: "Saturday AM", step: "4", title: "They're paid", desc: "Payment processed and compliance-checked automatically." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-zinc-200 p-6">
                <p className="text-xs font-semibold text-[var(--brand)]">{item.time}</p>
                <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-bold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="resources" className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-zinc-900">
            Don&apos;t take our word for it.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "We use MyHiredito for call-outs and events across 12 locations. It's been a game changer for coverage.",
                name: "Sarah M.",
                role: "Kitchen Manager, Multi-unit Group",
              },
              {
                quote: "MyHiredito has offered me an added level of confidence in scheduling and hiring for our properties.",
                name: "Troy",
                role: "Executive Chef, Hotel Partner",
              },
              {
                quote: "MyHiredito is an amazing tool to meet industry professionals that turn into full-time staff.",
                name: "Chris",
                role: "Chef, Restaurant Partner",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="text-amber-400">★★★★★</div>
                <p className="mt-4 text-sm leading-7 text-zinc-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6">
                  <div className="text-sm font-bold text-zinc-900">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start staffing with MyHiredito
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Post shifts, hire workers, and manage payouts from one place.
          </p>
          <Link
            href="/employer/signup"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--brand)] px-8 text-sm font-bold text-white transition hover:bg-[var(--brand-strong)]"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}

function MockPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3 text-sm font-bold text-zinc-700">
        {title}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
