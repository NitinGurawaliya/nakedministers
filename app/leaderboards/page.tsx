'use client';

import { useState, useMemo } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { getLeaderboard, ALL_STATES, HOUSES, type LeaderboardTab, type House } from '@/lib/data';
import { cn } from '@/lib/utils';

const TABS: { key: LeaderboardTab; label: string }[] = [
  { key: 'wealth', label: 'Most Wealth' },
  { key: 'growth', label: 'Fastest Growth %' },
  { key: 'criminal', label: 'Most Criminal Cases' },
  { key: 'switches', label: 'Most Party Switches' },
];

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<LeaderboardTab>('wealth');
  const [state, setState] = useState<string | null>(null);
  const [house, setHouse] = useState<House | null>(null);

  const results = useMemo(
    () => getLeaderboard(tab, state, house),
    [tab, state, house]
  );

  const activeFilterCount = [state, house].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Leaderboards
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ranked from public election affidavits.
        </p>
      </div>

      {/* Tab switcher */}
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

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setState(null);
                setHouse(null);
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* State filters */}
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

        {/* House filters */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            House
          </p>
          <div className="flex flex-wrap gap-2">
            {HOUSES.map((h) => (
              <FilterChip
                key={h}
                label={h}
                active={house === h}
                onClick={() => setHouse(house === h ? null : h)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{results.length}</span>{' '}
        {results.length === 1 ? 'politician' : 'politicians'}
      </p>

      {/* Leaderboard */}
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
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
