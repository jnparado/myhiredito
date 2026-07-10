import Link from "next/link";
import {
  NotificationAlertItem,
  NotificationMessageItem,
} from "@/app/components/worker/NotificationPanel";

type EmployerNotificationPanelProps = {
  unreadMessages: number;
  newApplicants: number;
  onboardingIncomplete: boolean;
  nextStep?: { step: number; label: string; href: string };
  completed: number;
  total: number;
  onClose: () => void;
  onOpenMessages: () => void;
};

export function EmployerNotificationPanel({
  unreadMessages,
  newApplicants,
  onboardingIncomplete,
  nextStep,
  completed,
  total,
  onClose,
  onOpenMessages,
}: EmployerNotificationPanelProps) {
  const hasContent =
    unreadMessages > 0 || newApplicants > 0 || onboardingIncomplete;

  return (
    <div className="fixed inset-x-3 top-[calc(100%+0.5rem)] z-50 w-auto overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:w-80">
      <div className="border-b border-zinc-100 px-4 py-3">
        <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
      </div>

      {hasContent ? (
        <div>
          {unreadMessages > 0 && (
            <NotificationMessageItem
              onClick={() => {
                onClose();
                onOpenMessages();
              }}
              title={`${unreadMessages} new message${unreadMessages === 1 ? "" : "s"}`}
              description="Workers and applicants are trying to reach you."
            />
          )}

          {newApplicants > 0 && (
            <Link
              href="/employer/applicants"
              onClick={onClose}
              className="block w-full border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-zinc-50"
            >
              <p className="text-sm font-bold text-zinc-900">
                {newApplicants} new applicant{newApplicants === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Review applications and respond while they&apos;re still warm.
              </p>
            </Link>
          )}

          {onboardingIncomplete && nextStep && (
            <NotificationAlertItem
              href={nextStep.href}
              onClick={onClose}
              title="Complete your business setup"
              subtitle={`Step ${nextStep.step} of ${total}: ${nextStep.label}`}
              status={`${completed}/${total} onboarding steps done`}
            />
          )}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-sm font-medium text-zinc-700">You&apos;re all caught up</p>
          <p className="mt-1 text-xs text-zinc-500">No new notifications right now.</p>
        </div>
      )}

      <div className="space-y-1 border-t border-zinc-100 px-4 py-3">
        {onboardingIncomplete && (
          <Link
            href="/employer/dashboard"
            onClick={onClose}
            className="block text-sm font-semibold text-[#1db954] hover:underline"
          >
            View onboarding tasks
          </Link>
        )}
        <Link
          href="/employer/applicants"
          onClick={onClose}
          className="block text-sm font-semibold text-[#1db954] hover:underline"
        >
          View applicants
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenMessages();
          }}
          className="block text-sm font-semibold text-[#1db954] hover:underline"
        >
          Open messages
        </button>
      </div>
    </div>
  );
}
