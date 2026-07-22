import { cn } from '@/lib/utils';

interface PartyBadgeProps {
  party: string;
  short: string;
  className?: string;
}

const PARTY_COLORS: Record<string, string> = {
  BJP: 'bg-orange-50 text-orange-700 border-orange-200',
  INC: 'bg-blue-50 text-blue-700 border-blue-200',
  AAP: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  TMC: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  DMK: 'bg-red-50 text-red-700 border-red-200',
  SHS: 'bg-amber-50 text-amber-800 border-amber-200',
  NCP: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  BJD: 'bg-green-50 text-green-700 border-green-200',
};

export function PartyBadge({ party, short, className }: PartyBadgeProps) {
  const colorClass = PARTY_COLORS[short] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
        colorClass,
        className
      )}
      title={party}
    >
      {short}
    </span>
  );
}
