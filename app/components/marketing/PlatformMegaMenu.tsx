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
    <div className="absolute left-0 right-0 top-full z-50 border-t border-zinc-200 bg-white shadow-xl">
      <div className="mx-auto grid max-w-5xl lg:grid-cols-[1fr_200px]">
        <div className="bg-white px-5 py-4 lg:px-6">
          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            What we offer
          </p>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            {[leftCol, rightCol].map((col, i) => (
              <div key={i} className="space-y-3">
                {col.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block"
                  >
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-900 group-hover:text-[#1db954]">
                      {item.title}
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-zinc-500 group-hover:text-zinc-700">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden border-l border-zinc-200 bg-zinc-50 px-4 py-4 lg:block">
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
              alt="Professional at work"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
          <Link
            href="/worker/jobs"
            className="mt-3 inline-flex font-mono text-[10px] font-bold uppercase tracking-wide text-[#1db954] transition hover:text-[#17a34a]"
          >
            Explore the Marketplace →
          </Link>
        </div>
      </div>
    </div>
  );
}
