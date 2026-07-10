"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

type Props = { children: ReactNode };

type State = { hasError: boolean };

export class WorkerRouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-lg font-bold text-zinc-900">This page couldn&apos;t load</p>
          <p className="mt-2 max-w-md text-sm text-zinc-600">
            Something went wrong loading Your Circle. Reload the page or return to your
            dashboard.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white"
            >
              Reload
            </button>
            <Link
              href="/worker/dashboard"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
