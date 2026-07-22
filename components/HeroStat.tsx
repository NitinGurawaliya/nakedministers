import { cn } from '@/lib/utils';

interface HeroStatProps {
  value: string;
  label: string;
  sublabel?: string;
  className?: string;
}

export function HeroStat({ value, label, sublabel, className }: HeroStatProps) {
  return (
    <div className={cn('text-center', className)}>
      <p className="animate-count-up text-6xl font-bold tracking-tight text-primary sm:text-7xl md:text-8xl">
        {value}
      </p>
      <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground sm:text-base">
        {label}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {sublabel}
        </p>
      )}
    </div>
  );
}
