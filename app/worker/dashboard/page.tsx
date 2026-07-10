import Link from "next/link";
import { WorkerShell } from "../../components/worker/WorkerShell";

const actions = [
  {
    title: "Browse Jobs",
    subtitle: "Find & apply to open shifts",
    href: "/worker/jobs",
    color: "bg-[#1a5c42] hover:bg-[#164d37]",
  },
  {
    title: "My Schedule",
    subtitle: "View upcoming & past shifts",
    href: "#",
    color: "bg-[#5cb85c] hover:bg-[#4cae4c]",
  },
  {
    title: "Update Profile",
    subtitle: "Skills, certifications & availability",
    href: "/worker/signup",
    color: "bg-[#337ab7] hover:bg-[#2e6da4]",
  },
  {
    title: "Contact Support",
    subtitle: "Get help with your account",
    href: "#",
    color: "bg-[#d9534f] hover:bg-[#c9302c]",
  },
];

const tasks = [
  { label: "Launch product tour", icon: "🚀" },
  { label: "Complete your profile", icon: "✅" },
  { label: "Add payment method", icon: "💳" },
];

export const metadata = {
  title: "Worker Dashboard | MyHiredito",
  description: "Your worker dashboard on MyHiredito.",
};

export default function WorkerDashboardPage() {
  return (
    <WorkerShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-zinc-800 sm:text-4xl">
            Hi there,
          </h1>
          <p className="mt-1 text-base text-zinc-500">
            Here&apos;s a snapshot of what&apos;s happening on your account
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-3">
              <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-sm font-semibold text-zinc-700">
                You have <span className="text-red-500">0</span> shifts coming up
              </span>
            </div>

            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-6 text-zinc-300">
                <svg className="mx-auto h-32 w-32" fill="none" viewBox="0 0 120 120" strokeWidth={1} stroke="currentColor">
                  <rect x="20" y="25" width="80" height="70" rx="4" />
                  <line x1="20" y1="45" x2="100" y2="45" />
                  <line x1="40" y1="25" x2="40" y2="15" />
                  <line x1="80" y1="25" x2="80" y2="15" />
                  <rect x="35" y="55" width="12" height="10" rx="1" fill="currentColor" opacity="0.3" stroke="none" />
                  <rect x="54" y="55" width="12" height="10" rx="1" fill="currentColor" opacity="0.3" stroke="none" />
                  <rect x="73" y="55" width="12" height="10" rx="1" fill="currentColor" opacity="0.3" stroke="none" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">
                Upcoming shifts you accept will appear here
              </p>
              <Link
                href="/worker/jobs"
                className="mt-6 inline-flex items-center justify-center rounded bg-[var(--brand)] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
              >
                Browse jobs now!
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="text-amber-400">★</span>
                <span>Employers that need to be rated will appear here</span>
              </div>
            </div>

            <div className="overflow-hidden rounded border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-100 px-4 py-3">
                <h2 className="text-sm font-bold text-zinc-700">MyHiredito Actions</h2>
              </div>
              <div className="divide-y divide-white/20">
                {actions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className={`flex items-center justify-between px-4 py-4 text-white transition ${action.color}`}
                  >
                    <div>
                      <div className="text-sm font-bold">{action.title}</div>
                      <div className="text-xs text-white/80">{action.subtitle}</div>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <h2 className="text-sm font-bold text-zinc-700">Onboarding Task List</h2>
              </div>
              <ul>
                {tasks.map((task, i) => (
                  <li key={task.label}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition hover:bg-zinc-50 ${
                        i === 0 ? "bg-zinc-50" : ""
                      }`}
                    >
                      <span className="flex items-center gap-3 text-zinc-700">
                        <span>{task.icon}</span>
                        {task.label}
                      </span>
                      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </WorkerShell>
  );
}
