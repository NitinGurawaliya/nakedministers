import { FileText, Calculator, AlertCircle, Mail } from 'lucide-react';

const SECTIONS = [
  {
    icon: FileText,
    title: 'Data Sources',
    body: [
      'All financial figures on Nanga Neta are sourced exclusively from publicly available election affidavits filed by candidates with the Election Commission of India. These documents are filed under oath by the candidate at the time of nomination.',
      'We transcribe the declared values for assets, liabilities, and income directly from these affidavits. We do not estimate, infer, or supplement this data with information from any other source.',
      'Affidavits are typically filed before each election cycle. Where a politician has contested multiple elections, we compare the earliest and most recent available affidavits to calculate growth over their time in office.',
    ],
  },
  {
    icon: Calculator,
    title: 'How Growth Percentages Are Calculated',
    body: [
      'Net worth is defined as total declared assets minus total declared liabilities, exactly as reported in the affidavit.',
      'Growth percentage is calculated as: ((Net worth in latest year − Net worth in earliest year) ÷ Net worth in earliest year) × 100.',
      'The "math reveal" sentence on each profile compares the total net worth growth across one full term against the declared annual income from the latest affidavit. The multiplier is computed as: Total growth ÷ (Annual income × 5 years). This gives a rough sense of how many times their declared income the wealth grew by.',
      'All figures are in Indian Rupees (INR). We display abbreviated formats (L for lakh, Cr for crore) for readability, with full figures available in the comparison table.',
    ],
  },
  {
    icon: AlertCircle,
    title: "What We Show — and What We Don't",
    body: [
      'We show only the data the politician themselves declared under oath: their own assets, liabilities, income, and criminal cases as listed in the affidavit.',
      'We do not show any information about family members, spouses, or dependents beyond what the politician has included in their own sworn declaration. We do not collect, display, or speculate about family wealth.',
      'We do not editorialize. The numbers are presented as declared. We do not allege corruption, illegality, or wrongdoing. Growth in declared wealth is not, by itself, evidence of any offence.',
      'Criminal case data reflects only what the candidate declared in their affidavit. Case statuses shown are as of the filing date and may have changed since.',
    ],
  },
  {
    icon: Mail,
    title: 'Reporting a Data Error',
    body: [
      'If you believe a figure on this site does not match the original affidavit, we want to know. Every profile includes a correction contact at the bottom of the page.',
      "Email us at corrections@nanganeta.in with the politician's name, the specific field in question, and (if possible) a reference to the original affidavit. We will review and update the record.",
      'We are committed to accuracy. If we have made a transcription error, we will correct it promptly and transparently.',
    ],
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          About Nanga Neta
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Methodology & Data Sources
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Nanga Neta is a civic transparency tool. We publish declared
          financial data from public election affidavits — nothing more, nothing
          less. Here's exactly how we do it.
        </p>
      </div>

      <div className="space-y-16">
        {SECTIONS.map((section, i) => (
          <section key={i}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-border bg-card">
                <section.icon className="h-5 w-5 text-foreground" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {section.title}
              </h2>
            </div>
            <div className="mt-4 space-y-4 pl-13">
              {section.body.map((para, j) => (
                <p
                  key={j}
                  className="text-base leading-relaxed text-muted-foreground"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-border bg-muted/30 p-6">
        <p className="text-sm font-medium text-foreground">
          Nanga Neta is not affiliated with any political party, government
          body, or the Election Commission of India. It is an independent civic
          tool built to make already-public data easier to access and
          understand.
        </p>
      </div>
    </div>
  );
}
