import Link from "next/link";
import { EmployerAccountShell } from "../../components/employer/EmployerAccountShell";
import { EmployerDashboardGreeting } from "../../components/employer/EmployerDashboardGreeting";
import { EmployerOnboardingAlert } from "../../components/employer/EmployerOnboardingAlert";
import { EmployerOnboardingTaskList } from "../../components/employer/EmployerOnboardingTaskList";

const actions = [
  {
    title: "Post a Job",
    subtitle: "Create a new role and start hiring",
    href: "#",
    color: "bg-[#1a5c42] hover:bg-[#164d37]",
  },
  {
    title: "Review Applicants",
    subtitle: "Screen verified worker applications",
    href: "#",
    color: "bg-[#5cb85c] hover:bg-[#4cae4c]",
  },
  {
    title: "Company Profile",
    subtitle: "Update business info and locations",
    href: "#",
    color: "bg-[#337ab7] hover:bg-[#2e6da4]",
  },
  {
    title: "Contact Support",
    subtitle: "Get help with your employer account",
    href: "#",
    color: "bg-[#d9534f] hover:bg-[#c9302c]",
  },
];

export const metadata = {
  title: "Employer Dashboard | MyHiredito",
  description: "Manage hiring and staffing on MyHiredito.",
};

export default function EmployerDashboardPage() {
  return (
    <EmployerAccountShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <EmployerDashboardGreeting />
        <EmployerOnboardingAlert />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-3">
              <svg
                className="h-5 w-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              <span className="text-sm font-semibold text-zinc-700">
                You have <span className="text-red-500">0</span> active job posts
              </span>
            </div>

            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-6 text-zinc-300">
                <svg
                  className="mx-auto h-32 w-32"
                  fill="none"
                  viewBox="0 0 120 120"
                  strokeWidth={1}
                  stroke="currentColor"
                >
                  <rect x="25" y="20" width="70" height="80" rx="4" />
                  <line x1="35" y1="40" x2="85" y2="40" />
                  <line x1="35" y1="55" x2="70" y2="55" />
                  <line x1="35" y1="70" x2="60" y2="70" />
                  <circle cx="80" cy="75" r="12" />
                  <path d="M76 75l3 3 6-6" strokeWidth={2} />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">
                Jobs you post will appear here once onboarding is complete
              </p>
              <button
                type="button"
                className="mt-6 inline-flex cursor-not-allowed items-center justify-center rounded bg-zinc-300 px-8 py-2.5 text-sm font-semibold text-zinc-600"
                disabled
              >
                Post your first job
              </button>
              <p className="mt-3 text-xs text-red-600">
                Finish employer onboarding to unlock job posting
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="text-amber-400">★</span>
                <span>Applicants waiting for review will appear here</span>
              </div>
            </div>

            <div className="overflow-hidden rounded border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-100 px-4 py-3">
                <h2 className="text-sm font-bold text-zinc-700">
                  MyHiredito Actions
                </h2>
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
                      <div className="text-xs text-white/80">
                        {action.subtitle}
                      </div>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <EmployerOnboardingTaskList />
          </div>
        </div>
      </div>
    </EmployerAccountShell>
  );
}
