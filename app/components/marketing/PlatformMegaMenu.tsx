import Link from "next/link";

const products = [
  {
    title: "The Marketplace",
    desc: "Build your talent bench. Intelligent matching, favorites, and real-time coverage.",
    href: "/worker/jobs",
  },
  {
    title: "Jobs",
    desc: "Hire with confidence. AI-scored candidates ranked by real shift performance.",
    href: "/employer",
  },
  {
    title: "Pay",
    desc: "W-2 and 1099 payroll across 50 states. Instant pay after every shift.",
    href: "#",
  },
  {
    title: "Compliance",
    desc: "Rules enforced as blocking constraints — before violations can occur.",
    href: "#",
  },
  {
    title: "Onboarding",
    desc: "Digital onboarding, I-9, and credential verification in one flow.",
    href: "#",
  },
  {
    title: "MyHiredito Intelligence",
    desc: "Four AI agents powering matching, screening, planning, and support.",
    href: "/#platform",
  },
  {
    title: "Event Management",
    desc: "Staff large events with drag-and-drop placement and real-time coverage.",
    href: "#",
  },
  {
    title: "Integrations",
    desc: "Connect with your POS, payroll, and HRIS systems seamlessly.",
    href: "#",
  },
];

export function PlatformMegaMenu() {
  const leftCol = products.slice(0, 4);
  const rightCol = products.slice(4);

  return (
    <div className="absolute left-0 right-0 top-full z-50 border-t border-zinc-200 bg-white shadow-2xl">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[1fr_300px]">
        {/* Left — white */}
        <div className="bg-white px-8 py-8 lg:px-10">
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
            What we offer
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {[leftCol, rightCol].map((col, i) => (
              <div key={i} className="space-y-8">
                {col.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block"
                  >
                    <div className="font-mono text-xs font-bold uppercase tracking-wide text-zinc-900 group-hover:text-[#1db954]">
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

        {/* Right — light gray */}
        <div className="hidden border-l border-zinc-200 bg-zinc-100 px-8 py-8 lg:block">
          <div className="overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80"
              alt="Professional at work"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <Link
            href="/worker/jobs"
            className="mt-5 inline-flex font-mono text-xs font-bold uppercase tracking-wide text-[#1db954] transition hover:text-[#17a34a]"
          >
            Explore the Marketplace →
          </Link>
        </div>
      </div>
    </div>
  );
}
