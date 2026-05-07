import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyHiredito",
  description: "Hire talent and find jobs with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
              aria-label="MyHiredito home"
            >
              <span className="text-lg">MyHiredito</span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 dark:text-zinc-200 md:flex">
              <Link
                className="hover:text-zinc-950 dark:hover:text-white"
                href="/worker"
              >
                Worker
              </Link>
              <Link
                className="hover:text-zinc-950 dark:hover:text-white"
                href="/freelancer"
              >
                Freelancer
              </Link>
              <Link className="hover:text-zinc-950 dark:hover:text-white" href="#">
                About
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/freelancer/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/freelancer/signup"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-auto border-t border-black/5 bg-white dark:border-white/10 dark:bg-black">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-md">
                <div className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  MyHiredito
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  A friendlier way to hire talent and find work.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
                <div className="space-y-3">
                  <div className="font-semibold text-zinc-950 dark:text-zinc-50">
                    Product
                  </div>
                  <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      How it works
                    </Link>
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Use cases
                    </Link>
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Pricing
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-semibold text-zinc-950 dark:text-zinc-50">
                    Company
                  </div>
                  <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      About
                    </Link>
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Contact
                    </Link>
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Careers
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-semibold text-zinc-950 dark:text-zinc-50">
                    Legal
                  </div>
                  <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Privacy
                    </Link>
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Terms
                    </Link>
                    <Link className="block hover:text-zinc-950 dark:hover:text-white" href="#">
                      Cookies
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-black/5 pt-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} MyHiredito. All rights reserved.</div>
              <div className="text-zinc-500">Built with Next.js</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
