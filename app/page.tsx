import Link from 'next/link';
import { FileSearch, Calculator, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PoliticianCard } from '@/components/PoliticianCard';
import { TRENDING } from '@/lib/data';

const STEPS = [
  {
    icon: FileSearch,
    title: 'We pull sworn election affidavits',
    description:
      'Every candidate files a sworn affidavit with the Election Commission. We collect these public documents.',
  },
  {
    icon: Calculator,
    title: 'We calculate the math',
    description:
      'We compare declared assets, liabilities, and income across election cycles to compute growth.',
  },
  {
    icon: Eye,
    title: 'You see the truth',
    description:
      'Browse any politician to see exactly how much wealth they declared, and how it changed over time.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative -mt-[88px] overflow-hidden pt-[88px]"
        style={{
          background:
            'linear-gradient(175deg, #F97316 0%, #FB923C 8%, #FED7AA 22%, #FFF7ED 38%, #FFFFFF 52%, #EFF6FF 68%, #DBEAFE 82%, #BFDBFE 100%)',
        }}
      >
        {/* Saffron radial glow top */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
        />
        {/* Blue radial glow bottom */}
        <div
          className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-0 sm:px-6 sm:pb-32 sm:pt-4 md:pt-8">
          <div className="mx-auto max-w-2xl text-center">

            {/* Indian Emblem */}
            <div className="mb-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/emblem_bg.png"
                alt="Emblem of India"
                className="h-16 w-auto object-contain opacity-90 sm:h-20"
              />
            </div>

            {/* Tricolour rule */}
            <div className="mx-auto mb-4 flex h-[3px] w-36 overflow-hidden rounded-full">
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-white ring-1 ring-inset ring-orange-200/40" />
              <div className="flex-1" style={{ background: '#138808' }} />
            </div>

            {/* Small tagline */}
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-800/70">
              Civic Transparency · Public Affidavit Data
            </p>

            {/* Single headline — no sub paragraph */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl md:text-[3.4rem] md:leading-[1.1]">
              Every rupee they declared.{' '}
              <span style={{ color: '#9A3412' }}>Every year they grew richer.</span>
            </h1>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/search">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-semibold shadow-md"
                  style={{ background: '#1a1a1a', color: '#fff' }}
                >
                  Search Your MP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/methodology">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-black/20 bg-white/70 px-8 text-base font-medium text-[#1a1a1a] backdrop-blur-sm hover:bg-white/90"
                >
                  How this works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending This Week */}
      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Trending This Week
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Highest declared wealth growth
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              View all →
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {TRENDING.map((p) => (
              <PoliticianCard key={p.candidateId} politician={p} variant="compact" />
            ))}
            <div className="w-px flex-none" />
          </div>
        </div>
      </section>

      {/* How This Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How This Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three steps. No opinions. Just the numbers they declared.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <step.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-border sm:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full border-2 border-foreground/80">
              <ShieldCheck className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Data sourced from Election Commission affidavits, verified
                against public records
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We only publish figures from sworn candidate filings. No
                speculation, no estimates, no family data beyond what the
                politician declared themselves.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
