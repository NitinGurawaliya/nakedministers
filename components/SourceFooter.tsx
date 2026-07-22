import { cn } from '@/lib/utils';

interface SourceFooterProps {
  source: string;
  date: string;
  className?: string;
}

export function SourceFooter({ source, date, className }: SourceFooterProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/20 p-6',
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-foreground text-xs font-bold">
              §
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">
              Source & Verification
            </p>
          </div>
          <p className="mt-3 text-sm text-foreground">
            {source}, filed {date}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Data transcribed from publicly available election affidavit
            documents. Figures are as declared by the candidate under oath.
          </p>
        </div>
        <div className="flex-none">
          <div className="rounded-md border-2 border-foreground/80 px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">
              Verified
            </p>
            <p className="text-xs font-semibold text-foreground/80">
              Public Record
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Report a data discrepancy:{' '}
        <span className="font-medium text-foreground underline underline-offset-2">
          corrections@nanganeta.in
        </span>
      </p>
    </div>
  );
}
