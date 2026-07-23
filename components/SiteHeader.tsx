import Link from 'next/link';
import { Scale } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-transparent px-4 pt-3 pb-3 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-full  bg-white/72 px-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/95 shadow-sm">
              <Scale className="h-5 w-5 text-background" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Naked Ministers
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/search"
              className="text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-foreground"
            >
              Search
            </Link>
            <Link
              href="/leaderboards"
              className="text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-foreground"
            >
              Leaderboards
            </Link>
            <Link
              href="/methodology"
              className="text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-foreground"
            >
              Methodology
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white/85 px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}