import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataSourceBadge, type DataSource } from './DataSourceBadge';
import { Sparkline } from './Sparkline';
import { GlassCard } from './GlassCard';

export type MetricStatus = 'good' | 'warning' | 'critical' | 'neutral';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  status?: MetricStatus;
  dataSource: DataSource;
  sparklineData?: number[];
  className?: string;
  animate?: boolean;
}

const statusColors: Record<
  MetricStatus,
  { 
    value: string; 
    delta: string; 
    sparkline: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
    glassStatus: 'success' | 'warning' | 'error' | 'neutral';
  }
> = {
  good: {
    value: 'text-emerald-400',
    delta: 'text-emerald-400',
    sparkline: 'green',
    glassStatus: 'success',
  },
  warning: {
    value: 'text-amber-400',
    delta: 'text-amber-400',
    sparkline: 'yellow',
    glassStatus: 'warning',
  },
  critical: {
    value: 'text-rose-400',
    delta: 'text-rose-400',
    sparkline: 'red',
    glassStatus: 'error',
  },
  neutral: {
    value: 'text-zinc-100',
    delta: 'text-zinc-400',
    sparkline: 'blue',
    glassStatus: 'neutral',
  },
};

export function MetricCard({
  title,
  value,
  unit,
  delta,
  deltaLabel = 'vs last period',
  status = 'neutral',
  dataSource,
  sparklineData,
  className,
  animate = false,
}: MetricCardProps) {
  const colors = statusColors[status];

  const DeltaIcon = delta === undefined ? Minus : delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <GlassCard
      status={colors.glassStatus}
      animate={animate}
      className={cn('p-6', className)}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        <DataSourceBadge source={dataSource} />
      </div>

      {/* Main Value */}
      <div className="mb-3 flex items-baseline gap-2">
        <span className={cn('text-4xl font-bold tracking-tight', colors.value)}>
          {value}
        </span>
        {unit && <span className="text-xl text-zinc-500">{unit}</span>}
      </div>

      {/* Delta & Sparkline */}
      <div className="flex items-center justify-between gap-4">
        {delta !== undefined && (
          <div className="flex items-center gap-1.5">
            <DeltaIcon className={cn('h-4 w-4', colors.delta)} />
            <span className={cn('text-sm font-semibold', colors.delta)}>
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1)}%
            </span>
            <span className="text-xs text-zinc-500">{deltaLabel}</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="ml-auto flex-shrink-0">
            <Sparkline data={sparklineData} color={colors.sparkline} width={100} height={32} />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
