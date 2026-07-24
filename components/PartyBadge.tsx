import { cn } from '@/lib/utils';
import { getPartyShort } from '@/lib/data';

interface PartyBadgeProps {
  party: string;
  short?: string;
  className?: string;
}

const PARTY_COLORS: Record<string, string> = {
  BJP: 'bg-orange-50 text-orange-700 border-orange-200',
  INC: 'bg-blue-50 text-blue-700 border-blue-200',
  AAP: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  AITC: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  TMC: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  DMK: 'bg-red-50 text-red-700 border-red-200',
  SP: 'bg-red-50 text-red-700 border-red-200',
  RJD: 'bg-green-50 text-green-700 border-green-200',
  TDP: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  IND: 'bg-gray-50 text-gray-700 border-gray-200',
  'CPI(M)': 'bg-red-50 text-red-800 border-red-200',
  'JD(U)': 'bg-green-50 text-green-800 border-green-200',
  NCP: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SHS: 'bg-amber-50 text-amber-800 border-amber-200',
};

function colorKey(label: string): string {
  if (PARTY_COLORS[label]) return label;
  const upper = label.toUpperCase();
  if (upper.includes('SHIV') || upper.includes('SHS')) return 'SHS';
  if (upper.includes('NATIONALIST CONGRESS') || upper.includes('NCP')) return 'NCP';
  if (upper.includes('TRINAMOOL') || upper === 'AITC') return 'AITC';
  return label;
}

export function PartyBadge({ party, short, className }: PartyBadgeProps) {
  const label = short ?? getPartyShort(party);
  const key = colorKey(label);
  const colorClass = PARTY_COLORS[key] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <span
      className={cn(
        'inline-flex max-w-[9rem] flex-none items-center truncate rounded-md border px-2 py-0.5 text-xs font-semibold',
        colorClass,
        className
      )}
      title={party}
    >
      {label}
    </span>
  );
}
