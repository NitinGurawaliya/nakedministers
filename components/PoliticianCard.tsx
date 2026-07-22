import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PartyBadge } from '@/components/PartyBadge';
import { formatINR } from '@/lib/data';
import type { Politician } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PoliticianCardProps {
  politician: Politician;
  variant?: 'default' | 'compact';
  className?: string;
}

export function PoliticianCard({
  politician,
  variant = 'default',
  className,
}: PoliticianCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/politician/${politician.id}`} className="group block">
        <Card
          className={cn(
            'flex w-[260px] flex-none gap-3 p-3 transition-all hover:shadow-md',
            className
          )}
        >
          <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-muted ring-1 ring-border">
            <Image
              src={politician.photo}
              alt={politician.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {politician.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {politician.constituency} · {politician.partyShort}
            </p>
            <p className="mt-1 text-lg font-bold text-primary">
              +{politician.growthPct}%
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/politician/${politician.id}`} className="group block">
      <Card
        className={cn(
          'overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5',
          className
        )}
      >
        <div className="flex items-start gap-4 p-5">
          <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-muted ring-1 ring-border">
            <Image
              src={politician.photo}
              alt={politician.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-foreground">
                {politician.name}
              </h3>
              <PartyBadge
                party={politician.party}
                short={politician.partyShort}
              />
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {politician.constituency}, {politician.state}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {politician.house}
            </p>
          </div>
        </div>
        <div className="border-t border-border bg-muted/30 px-5 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {politician.growthLabel}
          </p>
          <p className="mt-0.5 text-2xl font-bold text-primary">
            +{politician.growthPct}%
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {politician.startYear} → {politician.endYear}
          </p>
        </div>
      </Card>
    </Link>
  );
}
