'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PartyBadge } from '@/components/PartyBadge';
import { CandidatePhoto } from '@/components/CandidatePhoto';
import { CANDIDATES, ALL_STATES, ALL_PARTIES, getPartyShort } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

const SUGGESTIONS = CANDIDATES.slice(0, 12).map((c) => c.name);

type FilterKey = 'state' | 'party';
interface Filters {
  state: string | null;
  party: string | null;
}

export default function SearchPage() {
  const { navigateWithPreservedScroll, ready } = useScrollRestoration('/search');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    state: null,
    party: null,
  });

  const filteredSuggestions = useMemo(() => {
    const pool = query
      ? CANDIDATES.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        )
          .slice(0, 8)
          .map((c) => c.name)
      : SUGGESTIONS;
    return pool;
  }, [query]);

  const results = useMemo(() => {
    return CANDIDATES.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        const short = getPartyShort(p.party).toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.constituency.toLowerCase().includes(q) &&
          !p.state.toLowerCase().includes(q) &&
          !p.party.toLowerCase().includes(q) &&
          !short.includes(q)
        ) {
          return false;
        }
      }
      if (filters.state && p.state !== filters.state) return false;
      if (filters.party && p.party !== filters.party) return false;
      return true;
    });
  }, [query, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const from = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  }

  function clearFilters() {
    setFilters({ state: null, party: null });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Search Your MP
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse {CANDIDATES.length} profiles with declared wealth data from
          election affidavits.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, constituency, party, or state..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="h-14 rounded-lg border-border bg-card pl-12 pr-12 text-base shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <p className="border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Suggestions
            </p>
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                onMouseDown={() => {
                  setQuery(s);
                  setShowSuggestions(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="truncate text-sm text-foreground">{s}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
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
            {ALL_STATES.map((state) => (
              <FilterChip
                key={state}
                label={state}
                active={filters.state === state}
                onClick={() => toggleFilter('state', state)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Party
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_PARTIES.map((party) => (
              <FilterChip
                key={party.name}
                label={party.short}
                active={filters.party === party.name}
                onClick={() => toggleFilter('party', party.name)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span>{' '}
          {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <button
              key={p.candidateId}
              type="button"
              onClick={() =>
                navigateWithPreservedScroll(
                    `/politician/${p.candidateId}?from=${encodeURIComponent(from)}`,
                    p.candidateId
                )
              }
              className="text-left"
            >
                <Card id={`card-${p.candidateId}`} className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-4 p-5">
                  <CandidatePhoto
                    photoUrl={p.photoUrl}
                    name={p.name}
                    size={64}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                        {p.name}
                      </h3>
                      <PartyBadge party={p.party} short={getPartyShort(p.party)} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {p.constituency}, {p.state}
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card py-20 text-center">
          <p className="text-lg font-semibold text-foreground">No results found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
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
