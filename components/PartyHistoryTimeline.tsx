import { getPartySwitches, getPartySwitchCount, type Politician } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PartyHistoryTimelineProps {
  politician: Politician;
  className?: string;
}

export function PartyHistoryTimeline({ politician, className }: PartyHistoryTimelineProps) {
  const history = politician.partyHistory;
  const switches = getPartySwitches(politician);
  const switchCount = getPartySwitchCount(politician);
  const firstYear = history[0]?.year ?? politician.startYear;

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <p className="text-sm text-muted-foreground">
          Contested under{' '}
          <span className="font-semibold text-foreground">{switchCount}</span>{' '}
          {switchCount === 1 ? 'different party' : 'different parties'} since{' '}
          {firstYear}
        </p>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">No election history on record.</p>
      ) : (
        <div className="space-y-0">
          {history.map((entry, i) => {
            const switchInfo = switches.find((s) => s.year === entry.year);
            return (
              <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Line */}
                {i < history.length - 1 && (
                  <div className="absolute left-[7px] top-5 h-full w-px bg-border" />
                )}
                {/* Dot */}
                <div className="relative z-10 mt-1 flex-none">
                  <div
                    className={cn(
                      'h-3.5 w-3.5 rounded-full border-2',
                      entry.result === 'Won'
                        ? 'border-foreground bg-foreground'
                        : 'border-muted-foreground bg-background'
                    )}
                  />
                </div>
                {/* Content */}
                <div className="flex-1">
                  {switchInfo && (
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-medium text-primary">
                        Switched from {switchInfo.from} to {switchInfo.to}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-base font-semibold text-foreground">
                      {entry.year}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        entry.result === 'Won'
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {entry.result === 'Won' ? 'Won' : 'Lost'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {entry.constituency} · {entry.partyShort}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.party}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
