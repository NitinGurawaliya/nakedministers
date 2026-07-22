'use client';

import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PoliticianCard } from '@/components/PoliticianCard';
import { POLITICIANS, ALL_STATES, ALL_PARTIES, HOUSES } from '@/lib/data';
import type { House } from '@/lib/data';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  'Rajesh Khanna',
  'Priya Sharma',
  'Arjun Reddy',
  'Meera Iyer',
  'Vikram Singh',
  'Anita Deshmukh',
  'Sanjay Banerjee',
  'Deepak Patel',
];

type FilterKey = 'state' | 'party' | 'house';
interface Filters {
  state: string | null;
  party: string | null;
  house: House | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    state: null,
    party: null,
    house: null,
  });

  const filteredSuggestions = useMemo(() => {
    if (!query) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const results = useMemo(() => {
    return POLITICIANS.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.constituency.toLowerCase().includes(q) &&
          !p.state.toLowerCase().includes(q) &&
          !p.partyShort.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.state && p.state !== filters.state) return false;
      if (filters.party && p.party !== filters.party) return false;
      if (filters.house && p.house !== filters.house) return false;
      return true;
    });
  }, [query, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  }

  function clearFilters() {
    setFilters({ state: null, party: null, house: null });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Search Your MP
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse {POLITICIANS.length}+ profiles with declared wealth data from
          election affidavits.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, constituency, or state..."
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
                <span className="text-sm text-foreground">{s}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Chips */}
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

        {/* State filters */}
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

        {/* Party filters */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Party
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_PARTIES.map((party) => (
              <FilterChip
                key={party.short}
                label={party.short}
                active={filters.party === party.name}
                onClick={() => toggleFilter('party', party.name)}
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
            {HOUSES.map((house) => (
              <FilterChip
                key={house}
                label={house}
                active={filters.house === house}
                onClick={() => toggleFilter('house', house)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span>{' '}
          {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PoliticianCard key={p.id} politician={p} />
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
