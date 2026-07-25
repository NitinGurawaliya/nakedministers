import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { HeroStat } from '@/components/HeroStat';
import { ComparisonTable } from '@/components/ComparisonTable';
import { SourceFooter } from '@/components/SourceFooter';
import { PartyBadge } from '@/components/PartyBadge';
import { AssetBreakdownGrid } from '@/components/AssetBreakdownGrid';
import { AssetTrajectoryChart } from '@/components/AssetTrajectoryChart';
import { CriminalCasesSection } from '@/components/CriminalCasesSection';
import { ExpandableText } from '@/components/ExpandableText';
import { CandidatePhoto } from '@/components/CandidatePhoto';
import {
  CANDIDATES,
  DATA_SOURCE,
  DATA_SOURCE_DATE,
  getCandidate,
  getComparisonPoints,
  getGrowthPct,
  getGrowthYears,
  getMathReveal,
  getPartyShort,
  formatINR,
} from '@/lib/data';
import { BackLink } from '../../../components/BackLink';

export function generateStaticParams() {
  return CANDIDATES.map((c) => ({ id: String(c.candidateId) }));
}

export default async function PoliticianDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { from?: string };
}) {
  const candidate = getCandidate(params.id);
  if (!candidate) notFound();

  const growth = getGrowthPct(candidate);
  const years = getGrowthYears(candidate);
  const comparison = getComparisonPoints(candidate);
  const mathReveal = getMathReveal(candidate);
  const partyShort = getPartyShort(candidate.party);
  const backHref = searchParams?.from && searchParams.from.startsWith('/')
    ? searchParams.from
    : '/search';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink
        href={backHref}
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </BackLink>

      {/* Identity Strip */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <CandidatePhoto
          photoUrl={candidate.photoUrl}
          name={candidate.name}
          size={112}
          rounded="2xl"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl break-words">
              {candidate.name}
            </h1>
            <PartyBadge party={candidate.party} short={partyShort} />
          </div>
          <p className="mt-1 truncate text-muted-foreground" title={candidate.party}>
            {candidate.party}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 flex-none" />
              <span className="break-words">
                {candidate.constituency}, {candidate.state}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 flex-none" />
              Age {candidate.age}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Stat */}
      <div className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="pointer-events-none absolute inset-0 gradient-blob" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-20">
          {growth != null && years ? (
            <HeroStat
              value={`${growth > 0 ? '+' : ''}${growth}%`}
              label="Declared asset growth"
              sublabel={`${years.startYear} → ${years.endYear}`}
            />
          ) : (
            <HeroStat
              value={formatINR(candidate.totalAssets)}
              label="Total declared assets"
              sublabel="Latest affidavit"
            />
          )}
        </div>
      </div>

      {/* Comparison */}
      {comparison && comparison.start.year !== comparison.end.year && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
            Declared Wealth Comparison
          </h2>
          <ComparisonTable
            start={{ year: comparison.start.year, assets: comparison.start.assets }}
            end={{
              year: comparison.end.year,
              assets: comparison.end.assets,
              liabilities: comparison.end.liabilities,
              income: comparison.end.income,
            }}
          />
        </section>
      )}

      {/* Math Reveal */}
      <section className="mt-8">
        <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            In Plain Numbers
          </p>
          <p className="mt-2 text-lg font-medium leading-relaxed text-foreground">
            {mathReveal}
          </p>
        </div>
      </section>

      {/* Declared Wealth Breakdown */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Declared Wealth Breakdown
        </h2>
        <AssetBreakdownGrid candidate={candidate} />
      </section>

      {/* Asset Trajectory */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Asset Trajectory
          </h2>
        </div>
        <AssetTrajectoryChart candidate={candidate} />
      </section>

      {/* Criminal Cases */}
      <CriminalCasesSection candidate={candidate} className="mt-12" />

      {/* Background */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Background
          </h2>
        </div>
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Education
            </p>
            <div className="mt-2">
              <ExpandableText text={candidate.education || 'Not declared'} />
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Profession
            </p>
            <div className="mt-2">
              <ExpandableText text={candidate.profession || 'Not declared'} />
            </div>
          </div>
        </div>
      </section>

      {/* Source Footer */}
      <section className="mt-12">
        <SourceFooter source={DATA_SOURCE} date={DATA_SOURCE_DATE} />
      </section>
    </div>
  );
}
