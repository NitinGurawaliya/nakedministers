import Link from 'next/link';
import { Scale } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <Scale className="h-5 w-5 text-background" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Naked Ministers
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              A civic transparency tool tracking declared wealth growth from
              public election affidavits.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Platform
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/search"
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    Search MPs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboards"
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    Leaderboards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    Methodology
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                About
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/methodology"
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    Data Sources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    Report an Error
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Naked Ministers. All data sourced from
            publicly available Election Commission of India affidavits. This is
            a civic transparency tool, not affiliated with any political party
            or government body.
          </p>
        </div>
      </div>
    </footer>
  );
}
