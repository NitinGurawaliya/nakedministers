import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PartyBadge } from '@/components/PartyBadge';
import { CandidatePhoto } from '@/components/CandidatePhoto';
import {
  getLeaderboardStat,
  getPartyShort,
  type Candidate,
  type LeaderboardTab,
} from '@/lib/data';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  politicians: Candidate[];
  tab: LeaderboardTab;
  className?: string;
}

export function LeaderboardTable({ politicians, tab, className }: LeaderboardTableProps) {
  if (politicians.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-card py-20 text-center', className)}>
        <p className="text-lg font-semibold text-foreground">No results</p>
        <p className="mt-2 text-sm text-muted-foreground">
          No politicians match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {politicians.map((p, i) => (
        <Link
          key={p.candidateId}
          href={`/politician/${p.candidateId}`}
          className="group block"
        >
          <Card className="flex items-center gap-3 p-3 transition-all hover:shadow-md hover:-translate-y-0.5 sm:gap-4 sm:p-4">
            <div className="flex w-8 flex-none justify-center sm:w-10">
              <span
                className={cn(
                  'text-2xl font-bold tracking-tight sm:text-3xl',
                  i === 0
                    ? 'text-primary'
                    : i < 3
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {i + 1}
              </span>
            </div>
            <CandidatePhoto
              photoUrl={p.photoUrl}
              name={p.name}
              size={56}
              className="sm:h-14 sm:w-14"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {p.name}
                </h3>
                <PartyBadge party={p.party} short={getPartyShort(p.party)} />
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                {p.constituency}, {p.state}
              </p>
            </div>
            <div className="flex-none text-right">
              <p className="text-lg font-bold text-primary sm:text-xl">
                {getLeaderboardStat(p, tab)}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
