import rawCandidates from '@/data/candidates.json';

export interface AssetTrajectoryEntry {
  state: string;
  year: number;
  declaredAssets: number;
}

export interface PendingCaseDetail {
  status: string;
  serialNo: string;
  firNumber: string | null;
  caseNumber: string | null;
  court: string | null;
  ipcSections: string | null;
  otherActs: string | null;
  chargesFramed: boolean;
  dateChargesFramed: string | null;
  appealFiled: boolean;
  appealStatus: string | null;
}

export interface ConvictedCaseDetail {
  status: string;
  serialNo: string;
  firNumber?: string | null;
  caseNumber: string | null;
  court: string | null;
  ipcSections: string | null;
  otherActs: string | null;
  punishmentImposed: string | null;
  dateConvicted: string | null;
  appealFiled: boolean;
  appealStatus: string | null;
}

export interface Candidate {
  candidateId: number;
  name: string;
  photoUrl: string | null;
  constituency: string;
  state: string;
  party: string;
  age: number;
  criminalCasesPending: number;
  criminalCasesConvicted: number;
  briefChargeDescriptions: string[];
  pendingCaseDetails: PendingCaseDetail[];
  convictedCaseDetails: ConvictedCaseDetail[];
  totalAssets: number;
  totalLiabilities: number;
  selfIncomeLatest: number;
  spouseIncomeLatest: number | null;
  movableAssetsSelf: number;
  movableAssetsSpouse: number;
  immovableAssetsSelf: number;
  immovableAssetsSpouse: number;
  assetTrajectory: AssetTrajectoryEntry[];
  education: string;
  profession: string;
}

/** @deprecated Use Candidate — kept as alias for gradual migration */
export type Politician = Candidate;

export const CANDIDATES: Candidate[] = rawCandidates as Candidate[];

export const AVERAGE_HOME_PRICE = 3500000;

export const DATA_SOURCE = 'MyNeta / Election Commission of India — Affidavit';
export const DATA_SOURCE_DATE = 'Lok Sabha 2024';

export function getCandidate(id: string): Candidate | undefined {
  return CANDIDATES.find((c) => String(c.candidateId) === id);
}

/** @deprecated Use getCandidate */
export function getPolitician(id: string): Candidate | undefined {
  return getCandidate(id);
}

export function getSortedTrajectory(c: Candidate): AssetTrajectoryEntry[] {
  return [...c.assetTrajectory].sort((a, b) => a.year - b.year);
}

/** Growth % from earliest prior declaration to current totalAssets. Null if no prior data. */
export function getGrowthPct(c: Candidate): number | null {
  const traj = getSortedTrajectory(c);
  if (traj.length === 0) return null;
  const first = traj[0].declaredAssets;
  if (first <= 0) return null;
  return Math.round(((c.totalAssets - first) / first) * 100);
}

export function getGrowthYears(c: Candidate): { startYear: number; endYear: number } | null {
  const traj = getSortedTrajectory(c);
  if (traj.length === 0) return null;
  return { startYear: traj[0].year, endYear: 2024 };
}

/** Short label for party badges — acronyms stay as-is; long names get truncated. */
export function getPartyShort(party: string): string {
  if (party.length <= 8) return party;
  // Prefer parenthetical acronym if present, e.g. "Lok Janshakti Party(Ram Vilas)"
  const paren = party.match(/\(([^)]+)\)/);
  if (paren && paren[1].length <= 12 && paren[1].length >= 2) {
    const inner = paren[1];
    if (/^[A-Z0-9(&\-–—\s]+$/i.test(inner) && inner.length <= 8) return inner;
  }
  if (party.length <= 14) return party;
  return `${party.slice(0, 12)}…`;
}

export function getInitials(name: string): string {
  const parts = name
    .replace(/^(ADV\.?|DR\.?|SHRI\.?|SMT\.?|PROF\.?)\s+/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function hasSpouseData(c: Candidate): boolean {
  return (
    (c.spouseIncomeLatest != null && c.spouseIncomeLatest > 0) ||
    c.movableAssetsSpouse > 0 ||
    c.immovableAssetsSpouse > 0
  );
}

export const ALL_STATES = Array.from(new Set(CANDIDATES.map((c) => c.state))).sort();
export const ALL_PARTIES = Array.from(new Set(CANDIDATES.map((c) => c.party)))
  .sort()
  .map((name) => ({ name, short: getPartyShort(name) }));

export const TRENDING = [...CANDIDATES]
  .map((c) => ({ c, growth: getGrowthPct(c) }))
  .filter((x) => x.growth != null)
  .sort((a, b) => (b.growth ?? 0) - (a.growth ?? 0))
  .slice(0, 5)
  .map((x) => x.c);

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getMathReveal(c: Candidate): string {
  const growth = getGrowthPct(c);
  const years = getGrowthYears(c);
  const income = c.selfIncomeLatest;
  if (growth != null && years && income > 0) {
    const traj = getSortedTrajectory(c);
    const assetGrowth = c.totalAssets - traj[0].declaredAssets;
    const termYears = Math.max(years.endYear - years.startYear, 1);
    const multiplier = (assetGrowth / (income * termYears)).toFixed(1);
    return `Declared latest self income: ${formatINR(income)}. Asset growth since ${years.startYear}: ${formatINR(assetGrowth)} (${growth > 0 ? '+' : ''}${growth}%). That's roughly ${multiplier}x their annual income over that period.`;
  }
  return `Declared total assets: ${formatINR(c.totalAssets)}. Latest self income: ${formatINR(income)}. Total liabilities: ${formatINR(c.totalLiabilities)}.`;
}

export function getWealthTranslation(c: Candidate): string {
  const homes = Math.max(1, Math.round(c.totalAssets / AVERAGE_HOME_PRICE));
  return `${formatINR(c.totalAssets)} in declared assets ≈ the price of ${homes} average Indian homes`;
}

/** Match brief charge descriptions to a case via shared IPC section numbers. */
export function matchBriefCharges(
  ipcSections: string | null,
  briefs: string[]
): string[] {
  if (!ipcSections || briefs.length === 0) return [];
  const sections = ipcSections
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^IPC\s*/i, '').trim());
  if (sections.length === 0) return [];

  return briefs.filter((brief) => {
    const match = brief.match(/IPC\s*Section[-\s]*(\d+[A-Z]?)/i);
    if (!match) return false;
    const sec = match[1];
    return sections.some(
      (s) => s === sec || s.replace(/^0+/, '') === sec.replace(/^0+/, '')
    );
  });
}

export type LeaderboardTab = 'wealth' | 'growth' | 'criminal' | 'liabilities';

export function getLeaderboard(tab: LeaderboardTab, state: string | null): Candidate[] {
  let list = [...CANDIDATES];
  if (state) list = list.filter((p) => p.state === state);
  switch (tab) {
    case 'wealth':
      return list.sort((a, b) => b.totalAssets - a.totalAssets);
    case 'growth':
      return list.sort((a, b) => (getGrowthPct(b) ?? -Infinity) - (getGrowthPct(a) ?? -Infinity));
    case 'criminal':
      return list.sort(
        (a, b) =>
          b.criminalCasesPending + b.criminalCasesConvicted -
          (a.criminalCasesPending + a.criminalCasesConvicted)
      );
    case 'liabilities':
      return list.sort((a, b) => b.totalLiabilities - a.totalLiabilities);
    default:
      return list;
  }
}

export function getLeaderboardStat(c: Candidate, tab: LeaderboardTab): string {
  switch (tab) {
    case 'wealth':
      return formatINR(c.totalAssets);
    case 'growth': {
      const g = getGrowthPct(c);
      return g == null ? '—' : `${g > 0 ? '+' : ''}${g}%`;
    }
    case 'criminal': {
      const n = c.criminalCasesPending + c.criminalCasesConvicted;
      return `${n} ${n === 1 ? 'case' : 'cases'}`;
    }
    case 'liabilities':
      return formatINR(c.totalLiabilities);
    default:
      return '';
  }
}

/** Comparison points for wealth table: oldest trajectory → current. */
export function getComparisonPoints(c: Candidate): {
  start: { year: number; assets: number };
  end: { year: number; assets: number; liabilities: number; income: number };
} | null {
  const traj = getSortedTrajectory(c);
  if (traj.length < 1) return null;
  return {
    start: { year: traj[0].year, assets: traj[0].declaredAssets },
    end: {
      year: 2024,
      assets: c.totalAssets,
      liabilities: c.totalLiabilities,
      income: c.selfIncomeLatest,
    },
  };
}
