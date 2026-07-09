import Link from "next/link";

const solutions = [
  {
    title: "I need to fill a shift — fast",
    desc: "Same-day or this week. One role or a few.",
    href: "/employer",
  },
  {
    title: "I need ongoing, reliable coverage",
    desc: "Recurring shifts, a bench of favorites, and templates.",
    href: "/employer",
  },
  {
    title: "I want to hire full-time",
    desc: "Try before you hire with paid working shifts.",
    href: "/employer",
  },
  {
    title: "I need to pay my workers",
    desc: "W-2 and 1099 payroll across 50 states. Instant pay after every shift.",
    href: "#",
  },
  {
    title: "I need to stay compliant",
    desc: "Predictive scheduling, break rules, and classification guardrails.",
    href: "#",
  },
  {
    title: "I run events at scale",
    desc: "Staff large events with drag-and-drop placement and live tracking.",
    href: "#",
  },
  {
    title: "I run a national operation",
    desc: "Compliance, payroll, hiring, and white-label — all in one platform.",
    href: "/employer/signup",
  },
  {
    title: "I'm a professional looking for work",
    desc: "Browse open shifts, build your profile, and get paid fast.",
    href: "/worker/jobs",
  },
];

export function HowWeHelpMegaMenu() {
  const leftCol = solutions.slice(0, 4);
  const rightCol = solutions.slice(4);

  return (
    <div className="absolute left-0 right-0 top-full z-50 px-4 pt-2 lg:px-6">
      <div className="mx-auto max-w-[900px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="px-8 py-8 lg:px-10">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
            What are you trying to solve?
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {[leftCol, rightCol].map((col, i) => (
              <div key={i} className="space-y-8">
                {col.map((item) => (
                  <Link key={item.title} href={item.href} className="group block">
                    <div className="text-sm font-bold uppercase tracking-wide text-zinc-900 group-hover:text-[#1db954]">
                      {item.title}
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-zinc-600 group-hover:text-zinc-800">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8 border-t border-zinc-100 px-8 py-5 lg:px-10">
          <Link
            href="/#resources"
            className="text-sm font-bold text-zinc-900 transition hover:text-[#1db954]"
          >
            Customer stories →
          </Link>
          <Link
            href="/employer/signup"
            className="text-sm font-bold text-zinc-900 transition hover:text-[#1db954]"
          >
            Get started →
          </Link>
        </div>
      </div>
    </div>
  );
}
