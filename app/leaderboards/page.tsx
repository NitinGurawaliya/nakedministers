'use client';

import { useState, useMemo } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { getLeaderboard, ALL_STATES, type LeaderboardTab } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

const TABS: { key: LeaderboardTab; label: string }[] = [
  { key: 'wealth', label: 'Most Wealth' },
  { key: 'growth', label: 'Fastest Growth %' },
  { key: 'criminal', label: 'Most Criminal Cases' },
  { key: 'liabilities', label: 'Highest Liabilities' },
];

export default function LeaderboardsPage() {
  const { ready } = useScrollRestoration('/leaderboards');
  const [tab, setTab] = useState<LeaderboardTab>('wealth');
  const [state, setState] = useState<string | null>(null);

  const results = useMemo(() => getLeaderboard(tab, state), [tab, state]);

  const activeFilterCount = state ? 1 : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Leaderboards
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ranked from public election affidavits.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              tab === t.key
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setState(null)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            State
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATES.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={state === s}
                onClick={() => setState(state === s ? null : s)}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{results.length}</span>{' '}
        {results.length === 1 ? 'politician' : 'politicians'}
      </p>

      <LeaderboardTable politicians={results} tab={tab} />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'max-w-[14rem] truncate rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
