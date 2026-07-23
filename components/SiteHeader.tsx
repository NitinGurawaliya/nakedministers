import Link from 'next/link';
import { Scale } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <Scale className="h-5 w-5 text-background" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Naked Ministers
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Search
          </Link>
          <Link
            href="/leaderboards"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Leaderboards
          </Link>
          <Link
            href="/methodology"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
