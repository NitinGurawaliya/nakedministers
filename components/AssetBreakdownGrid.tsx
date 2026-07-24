import { Card } from '@/components/ui/card';
import {
  formatINR,
  getWealthTranslation,
  hasSpouseData,
  type Candidate,
} from '@/lib/data';
import { cn } from '@/lib/utils';

interface AssetBreakdownGridProps {
  candidate: Candidate;
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

export function AssetBreakdownGrid({ candidate, className }: AssetBreakdownGridProps) {
  const showSpouse = hasSpouseData(candidate);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          value={formatINR(candidate.movableAssetsSelf)}
          label="Movable assets (self)"
        />
        <StatCard
          value={formatINR(candidate.immovableAssetsSelf)}
          label="Immovable assets (self)"
        />
        <StatCard
          value={formatINR(candidate.selfIncomeLatest)}
          label="Latest income (self)"
        />
        {showSpouse ? (
          <>
            <StatCard
              value={formatINR(candidate.movableAssetsSpouse)}
              label="Movable assets (spouse)"
            />
            <StatCard
              value={formatINR(candidate.immovableAssetsSpouse)}
              label="Immovable assets (spouse)"
            />
            <StatCard
              value={
                candidate.spouseIncomeLatest != null && candidate.spouseIncomeLatest > 0
                  ? formatINR(candidate.spouseIncomeLatest)
                  : '—'
              }
              label="Latest income (spouse)"
            />
          </>
        ) : (
          <StatCard
            value="—"
            label="Spouse assets / income"
            sublabel="No spouse data declared"
          />
        )}
        <StatCard
          value={formatINR(candidate.totalLiabilities)}
          label="Total liabilities"
        />
        <StatCard
          value={formatINR(candidate.totalAssets)}
          label="Total assets"
        />
      </div>
      <div className="rounded-xl border border-border bg-muted/30 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Translate the wealth
        </p>
        <p className="mt-2 text-lg font-medium leading-relaxed text-foreground">
          {getWealthTranslation(candidate)}
        </p>
      </div>
    </div>
  );
}
