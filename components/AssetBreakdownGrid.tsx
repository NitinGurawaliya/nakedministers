import { Card } from '@/components/ui/card';
import { formatINR, getWealthTranslation, type Politician } from '@/lib/data';
import { cn } from '@/lib/utils';

interface AssetBreakdownGridProps {
  politician: Politician;
  className?: string;
}

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
}

function StatCard({ value, label, sublabel }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-sm text-muted-foreground">{sublabel}</p>
      )}
    </Card>
  );
}

export function AssetBreakdownGrid({ politician, className }: AssetBreakdownGridProps) {
  const a = politician.assets;
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          value={`${a.vehicles.count}`}
          label="Vehicles owned"
          sublabel={a.vehicles.description}
        />
        <StatCard
          value={`${a.properties.count}`}
          label="Properties owned"
          sublabel={a.properties.description}
        />
        <StatCard
          value={formatINR(a.goldValue)}
          label="Gold & jewellery value"
        />
        <StatCard
          value={formatINR(a.loansGiven)}
          label="Personal loans given out"
        />
        <StatCard
          value={`${a.bankAccounts}`}
          label="Bank accounts held"
        />
        <StatCard
          value={a.wealthRank}
          label="Wealth rank"
        />
      </div>
      <div className="rounded-xl border border-border bg-muted/30 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Translate the wealth
        </p>
        <p className="mt-2 text-lg font-medium leading-relaxed text-foreground">
          {getWealthTranslation(politician)}
        </p>
      </div>
    </div>
  );
}
