'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card } from '@/components/ui/card';
import { formatINR, getSortedTrajectory, type Candidate } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

interface AssetTrajectoryChartProps {
  candidate: Candidate;
  className?: string;
}

const chartConfig = {
  declaredAssets: {
    label: 'Declared assets',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function AssetTrajectoryChart({ candidate, className }: AssetTrajectoryChartProps) {
  const traj = getSortedTrajectory(candidate);
  const chartable = traj.length >= 2;

  // Build points: prior declarations + current totalAssets as 2024 if not already present
  const points = chartable
    ? (() => {
        const rows = traj.map((e) => ({
          year: String(e.year),
          declaredAssets: e.declaredAssets,
          label: e.state,
        }));
        const has2024 = traj.some((e) => e.year === 2024);
        if (!has2024) {
          rows.push({
            year: '2024',
            declaredAssets: candidate.totalAssets,
            label: candidate.state,
          });
        }
        return rows.sort((a, b) => Number(a.year) - Number(b.year));
      })()
    : [];

  if (!chartable) {
    return (
      <Card className={cn('px-6 py-10 text-center', className)}>
        <p className="text-sm text-muted-foreground">
          First-time candidate — no prior declaration on record
        </p>
        {traj.length === 1 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Only one prior filing ({traj[0].year}): {formatINR(traj[0].declaredAssets)}
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card className={cn('p-4 sm:p-6', className)}>
      <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
        <BarChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="year" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v) => formatINR(Number(v)).replace('₹', '')}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatINR(Number(value))}
              />
            }
          />
          <Bar
            dataKey="declaredAssets"
            fill="var(--color-declaredAssets)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
      <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
        {points.map((p) => (
          <li
            key={p.year}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="text-muted-foreground">
              {p.year}
              {p.label ? ` · ${p.label}` : ''}
            </span>
            <span className="font-semibold text-foreground">
              {formatINR(p.declaredAssets)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
