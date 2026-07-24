import type { ReactNode } from 'react';
import { Gavel } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  matchBriefCharges,
  type Candidate,
  type ConvictedCaseDetail,
  type PendingCaseDetail,
} from '@/lib/data';
import { cn } from '@/lib/utils';

interface CriminalCasesSectionProps {
  candidate: Candidate;
  className?: string;
}

function displayOrDash(value: string | null | undefined): string {
  if (value == null || String(value).trim() === '') return '—';
  return value;
}

function CaseCard({
  status,
  firNumber,
  caseNumber,
  court,
  ipcSections,
  otherActs,
  briefs,
  extra,
}: {
  status: 'pending' | 'convicted';
  firNumber?: string | null;
  caseNumber?: string | null;
  court?: string | null;
  ipcSections?: string | null;
  otherActs?: string | null;
  briefs: string[];
  extra?: ReactNode;
}) {
  const matched = matchBriefCharges(ipcSections ?? null, briefs);
  const isPending = status === 'pending';

  return (
    <Card className="p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
            isPending
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-red-200 bg-red-50 text-red-800'
          )}
        >
          {isPending ? 'Pending' : 'Convicted'}
        </span>
        {(firNumber || caseNumber) && (
          <span className="text-xs font-medium text-muted-foreground">
            {firNumber ? `FIR ${firNumber}` : null}
            {firNumber && caseNumber ? ' · ' : null}
            {caseNumber ? `Case ${caseNumber}` : null}
          </span>
        )}
      </div>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Court</dt>
          <dd className="mt-0.5 text-foreground">{displayOrDash(court)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">IPC sections</dt>
          <dd className="mt-0.5 text-foreground">{displayOrDash(ipcSections)}</dd>
        </div>
        {otherActs && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Other acts</dt>
            <dd className="mt-0.5 text-foreground">{otherActs}</dd>
          </div>
        )}
      </dl>
      {matched.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-border pt-3">
          {matched.map((b, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              {b}
            </li>
          ))}
        </ul>
      )}
      {extra}
    </Card>
  );
}

function PendingCard({
  detail,
  briefs,
}: {
  detail: PendingCaseDetail;
  briefs: string[];
}) {
  return (
    <CaseCard
      status="pending"
      firNumber={detail.firNumber}
      caseNumber={detail.caseNumber}
      court={detail.court}
      ipcSections={detail.ipcSections}
      otherActs={detail.otherActs}
      briefs={briefs}
      extra={
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Charges framed:{' '}
            {detail.chargesFramed
              ? `Yes${detail.dateChargesFramed ? ` (${detail.dateChargesFramed})` : ''}`
              : 'No'}
          </span>
          {detail.appealFiled && (
            <span>Appeal: {displayOrDash(detail.appealStatus)}</span>
          )}
        </div>
      }
    />
  );
}

function ConvictedCard({
  detail,
  briefs,
}: {
  detail: ConvictedCaseDetail;
  briefs: string[];
}) {
  return (
    <CaseCard
      status="convicted"
      firNumber={detail.firNumber}
      caseNumber={detail.caseNumber}
      court={detail.court}
      ipcSections={detail.ipcSections}
      otherActs={detail.otherActs}
      briefs={briefs}
      extra={
        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {detail.punishmentImposed && (
            <p>Punishment: {detail.punishmentImposed}</p>
          )}
          {detail.dateConvicted && <p>Convicted: {detail.dateConvicted}</p>}
          {detail.appealFiled && (
            <p>Appeal: {displayOrDash(detail.appealStatus)}</p>
          )}
        </div>
      }
    />
  );
}

export function CriminalCasesSection({ candidate, className }: CriminalCasesSectionProps) {
  const pending = candidate.pendingCaseDetails ?? [];
  const convicted = candidate.convictedCaseDetails ?? [];
  const briefs = candidate.briefChargeDescriptions ?? [];

  return (
    <section className={cn(className)}>
      <div className="mb-4 flex items-center gap-2">
        <Gavel className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Declared Criminal Cases
        </h2>
      </div>

      <Card className="mb-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-8 border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pending
            </p>
            <p className="text-2xl font-bold text-foreground">
              {candidate.criminalCasesPending}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Convicted
            </p>
            <p className="text-2xl font-bold text-foreground">
              {candidate.criminalCasesConvicted}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pending cases
          </h3>
          {pending.length === 0 ? (
            <Card className="px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No pending cases declared
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pending.map((d, i) => (
                <PendingCard
                  key={`${d.serialNo}-${i}`}
                  detail={d}
                  briefs={briefs}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Convicted cases
          </h3>
          {convicted.length === 0 ? (
            <Card className="px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No convicted cases declared
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {convicted.map((d, i) => (
                <ConvictedCard
                  key={`${d.serialNo}-${i}`}
                  detail={d}
                  briefs={briefs}
                />
              ))}
            </div>
          )}
        </div>

        {briefs.length > 0 && pending.length === 0 && convicted.length === 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Charge summaries
            </h3>
            <Card className="p-5">
              <ul className="space-y-2">
                {briefs.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
