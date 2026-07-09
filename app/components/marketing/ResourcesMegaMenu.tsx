import Link from "next/link";

const learnLinks = [
  { label: "Blog", href: "#" },
  { label: "Customer Stories", href: "/#resources" },
  { label: "Integrations", href: "#" },
  { label: "Help Center", href: "#" },
  { label: "Robotics & AI", href: "#" },
];

const companyLinks = [
  { label: "Our Mission", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Refer a Business", href: "/employer/signup" },
];

export function ResourcesMegaMenu() {
  return (
    <div className="absolute left-0 right-0 top-full z-50 flex">
      <div className="hidden w-4 shrink-0 bg-[#1db954] lg:block" />
      <div className="flex-1 bg-white px-8 py-10 lg:px-12">
          <div className="mx-auto grid max-w-2xl gap-12 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                Learn
              </p>
              <ul className="mt-5 space-y-3">
                {learnLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:text-[#1db954]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                Company
              </p>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs font-bold uppercase tracking-wide text-zinc-900 transition hover:text-[#1db954]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      <div className="hidden w-4 shrink-0 bg-[#1db954] lg:block" />
    </div>
  );
}
