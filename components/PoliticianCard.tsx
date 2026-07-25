import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PartyBadge } from '@/components/PartyBadge';
import { CandidatePhoto } from '@/components/CandidatePhoto';
import {
  formatINR,
  getGrowthPct,
  getGrowthYears,
  getPartyShort,
  type Candidate,
} from '@/lib/data';
import { cn } from '@/lib/utils';

interface PoliticianCardProps {
  politician: Candidate;
  variant?: 'default' | 'compact';
  className?: string;
  href?: string;
  preserveScroll?: boolean;
}

export function PoliticianCard({
  politician,
  variant = 'default',
  className,
  href,
  preserveScroll = false,
}: PoliticianCardProps) {
  const growth = getGrowthPct(politician);
  const years = getGrowthYears(politician);
  const partyShort = getPartyShort(politician.party);
  const destination = href ?? `/politician/${politician.candidateId}`;

  if (variant === 'compact') {
    return (
      <Link href={destination} scroll={!preserveScroll ? undefined : false} className="group block">
        <Card
          id={`card-${politician.candidateId}`}
          className={cn(
            'flex w-[260px] flex-none gap-3 p-3 transition-all hover:shadow-md',
            className
          )}
        >
          <CandidatePhoto
            photoUrl={politician.photoUrl}
            name={politician.name}
            size={64}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {politician.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {politician.constituency} · {partyShort}
            </p>
            <p className="mt-1 text-lg font-bold text-primary">
              {growth != null ? `${growth > 0 ? '+' : ''}${growth}%` : formatINR(politician.totalAssets)}
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={destination} scroll={!preserveScroll ? undefined : false} className="group block">
      <Card
        id={`card-${politician.candidateId}`}
        className={cn(
          'overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5',
          className
        )}
      >
        <div className="flex items-start gap-4 p-5">
          <CandidatePhoto
            photoUrl={politician.photoUrl}
            name={politician.name}
            size={64}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                {politician.name}
              </h3>
              <PartyBadge party={politician.party} short={partyShort} />
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {politician.constituency}, {politician.state}
            </p>
          </div>
        </div>
        <div className="border-t border-border bg-muted/30 px-5 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {growth != null ? 'Asset growth' : 'Total assets'}
          </p>
          <p className="mt-0.5 text-2xl font-bold text-primary">
            {growth != null
              ? `${growth > 0 ? '+' : ''}${growth}%`
              : formatINR(politician.totalAssets)}
          </p>
          {years && growth != null ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {years.startYear} → {years.endYear}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatINR(politician.totalAssets)} declared
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
