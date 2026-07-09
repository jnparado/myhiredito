import Link from "next/link";

const industriesCol1 = [
  "Restaurants & Bars",
  "Catering & Events",
  "Hotels",
  "Country Clubs",
  "Senior Living",
  "QSRs",
];

const industriesCol2 = [
  "Event Venues",
  "Corporate Dining",
  "Foodservice Mgmt",
  "Event Management",
  "Stadiums",
  "Casinos",
];

const bySize = [
  {
    title: "SMB",
    desc: "Single location, lean team",
    href: "/employer",
  },
  {
    title: "Multi-Unit",
    desc: "Multiple locations, shared staff",
    href: "/employer",
  },
  {
    title: "Enterprise",
    desc: "National footprint, complex ops",
    href: "/employer/signup",
  },
];

export function WhoWeServeMegaMenu() {
  return (
    <div className="absolute left-0 right-0 top-full z-50 px-4 pt-2 lg:px-6">
      <div className="mx-auto max-w-[1000px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="grid gap-8 px-8 py-8 lg:grid-cols-3 lg:px-10">
          {/* By industry col 1 */}
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              By industry
            </p>
            <ul className="mt-5 space-y-3">
              {industriesCol1.map((item) => (
                <li key={item}>
                  <Link
                    href="/employer"
                    className="text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:text-[#1db954]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* By industry col 2 */}
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              By industry (cont.)
            </p>
            <ul className="mt-5 space-y-3">
              {industriesCol2.map((item) => (
                <li key={item}>
                  <Link
                    href="/employer"
                    className="text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:text-[#1db954]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* By size */}
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              By size
            </p>
            <ul className="mt-5 space-y-6">
              {bySize.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="group block">
                    <div className="text-sm font-bold uppercase tracking-wide text-zinc-900 group-hover:text-[#1db954]">
                      {item.title}
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 group-hover:text-zinc-800">
                      {item.desc}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-8 border-t border-zinc-100 px-8 py-5 lg:px-10">
          <Link
            href="/employer/signup"
            className="text-sm font-bold text-zinc-900 transition hover:text-[#1db954]"
          >
            Get started →
          </Link>
          <Link
            href="/worker/jobs"
            className="text-sm font-bold text-zinc-900 transition hover:text-[#1db954]"
          >
            Browse local talent →
          </Link>
        </div>
      </div>
    </div>
  );
}
