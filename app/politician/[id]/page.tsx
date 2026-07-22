import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, GraduationCap, Gavel, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HeroStat } from '@/components/HeroStat';
import { ComparisonTable } from '@/components/ComparisonTable';
import { SourceFooter } from '@/components/SourceFooter';
import { PartyBadge } from '@/components/PartyBadge';
import { AssetBreakdownGrid } from '@/components/AssetBreakdownGrid';
import { PartyHistoryTimeline } from '@/components/PartyHistoryTimeline';
import { getPolitician, getMathReveal, formatINR } from '@/lib/data';

export function generateStaticParams() {
  return [
    'rajesh-khanna',
    'priya-sharma',
    'arjun-reddy',
    'meera-iyer',
    'vikram-singh',
    'anita-deshmukh',
    'sanjay-banerjee',
    'deepak-patel',
    'kavita-nair',
    'rohit-yadav',
    'sunita-devi',
    'amit-kumar',
    'lakshmi-venkatesh',
    'om-prakash',
  ].map((id) => ({ id }));
}

export default async function PoliticianDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const politician = getPolitician(params.id);
  if (!politician) notFound();

  const start = politician.affidavits[0];
  const end = politician.affidavits[1];
  const mathReveal = getMathReveal(politician);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Back link */}
      <Link
        href="/search"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>

      {/* Identity Strip */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 flex-none overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
          <Image
            src={politician.photo}
            alt={politician.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {politician.name}
            </h1>
            <PartyBadge
              party={politician.party}
              short={politician.partyShort}
            />
          </div>
          <p className="mt-1 text-muted-foreground">{politician.party}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {politician.constituency}, {politician.state}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Age {politician.age}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Term: {politician.currentTerm}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              {politician.education}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {politician.house}
          </p>
        </div>
      </div>

      {/* Hero Stat Section */}
      <div className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="pointer-events-none absolute inset-0 gradient-blob" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-20">
          <HeroStat
            value={`+${politician.growthPct}%`}
            label={politician.growthLabel}
            sublabel={`${politician.startYear} → ${politician.endYear}`}
          />
        </div>
      </div>

      {/* Comparison Table */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Declared Wealth Comparison
        </h2>
        <ComparisonTable start={start} end={end} />
      </section>

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

      {/* Declared Assets Breakdown */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Declared Assets Breakdown
        </h2>
        <AssetBreakdownGrid politician={politician} />
      </section>

      {/* Criminal Cases */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Gavel className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Declared Criminal Cases
          </h2>
        </div>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Pending cases ({politician.startYear})
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {politician.criminalCases.before}
                </p>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Pending cases ({politician.endYear})
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {politician.criminalCases.after}
                </p>
              </div>
            </div>
          </div>
          {politician.criminalCases.details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Filed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {politician.criminalCases.details.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {c.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {c.section}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {c.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {c.filedYear}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No criminal cases declared in either affidavit.
              </p>
            </div>
          )}
        </Card>
      </section>

      {/* Political History */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Political History
          </h2>
        </div>
        <Card className="p-6">
          <PartyHistoryTimeline politician={politician} />
        </Card>
      </section>

      {/* Source Footer */}
      <section className="mt-12">
        <SourceFooter source={politician.source} date={politician.sourceDate} />
      </section>
    </div>
  );
}
