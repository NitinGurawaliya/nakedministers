import { Card } from '@/components/ui/card';
import { formatINR, formatINRFull, type AffidavitYear } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  start: AffidavitYear;
  end: AffidavitYear;
  className?: string;
}

function Row({
  label,
  startValue,
  endValue,
  isCurrency = true,
}: {
  label: string;
  startValue: number;
  endValue: number;
  isCurrency?: boolean;
}) {
  const diff = endValue - startValue;
  const isPositive = diff >= 0;
  return (
    <div className="grid grid-cols-3 items-center gap-4 border-b border-border px-6 py-4 last:border-0">
      <div className="col-span-3 -mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:col-span-1 sm:mb-0">
        {label}
      </div>
      <div className="sm:col-span-1">
        <p className="text-sm font-semibold text-foreground sm:text-base">
          {isCurrency ? formatINR(startValue) : startValue}
        </p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {formatINRFull(startValue)}
        </p>
      </div>
      <div className="sm:col-span-1">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {isCurrency ? formatINR(endValue) : endValue}
          </p>
          <span
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-primary' : 'text-emerald-600'
            )}
          >
            {isPositive ? '+' : ''}
            {isCurrency ? formatINR(diff) : diff}
          </span>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {formatINRFull(endValue)}
        </p>
      </div>
    </div>
  );
}

export function ComparisonTable({ start, end, className }: ComparisonTableProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/40 px-6 py-3">
        <div className="col-span-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:col-span-1">
          Category
        </div>
        <div className="hidden text-sm font-semibold text-foreground sm:block">
          {start.year}
        </div>
        <div className="hidden text-sm font-semibold text-foreground sm:block">
          {end.year}
        </div>
      </div>
      <Row label="Net Worth" startValue={start.netWorth} endValue={end.netWorth} />
      <Row label="Total Assets" startValue={start.assets} endValue={end.assets} />
      <Row
        label="Liabilities"
        startValue={start.liabilities}
        endValue={end.liabilities}
      />
      <Row
        label="Declared Income"
        startValue={start.declaredIncome}
        endValue={end.declaredIncome}
      />
    </Card>
  );
}
