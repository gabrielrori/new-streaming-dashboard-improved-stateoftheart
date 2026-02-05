import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataSourceBadge, type DataSource } from './DataSourceBadge';
import { Sparkline } from './Sparkline';

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
}

const statusColors: Record<MetricStatus, { value: string; delta: string; sparkline: 'blue' | 'green' | 'red' | 'yellow' | 'purple' }> = {
  good: {
    value: 'text-emerald-400',
    delta: 'text-emerald-400',
    sparkline: 'green',
  },
  warning: {
    value: 'text-yellow-400',
    delta: 'text-yellow-400',
    sparkline: 'yellow',
  },
  critical: {
    value: 'text-red-400',
    delta: 'text-red-400',
    sparkline: 'red',
  },
  neutral: {
    value: 'text-gray-200',
    delta: 'text-gray-400',
    sparkline: 'blue',
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
}: MetricCardProps) {
  const colors = statusColors[status];

  const DeltaIcon = delta === undefined ? Minus : delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-4 backdrop-blur-sm transition-all hover:border-white/20',
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <DataSourceBadge source={dataSource} />
      </div>

      {/* Main Value */}
      <div className="mb-2 flex items-baseline gap-2">
        <span className={cn('text-3xl font-bold tracking-tight', colors.value)}>
          {value}
        </span>
        {unit && <span className="text-lg text-gray-500">{unit}</span>}
      </div>

      {/* Delta & Sparkline */}
      <div className="flex items-center justify-between">
        {delta !== undefined && (
          <div className="flex items-center gap-1">
            <DeltaIcon className={cn('h-4 w-4', colors.delta)} />
            <span className={cn('text-sm font-medium', colors.delta)}>
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">{deltaLabel}</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="ml-auto">
            <Sparkline data={sparklineData} color={colors.sparkline} width={80} height={24} />
          </div>
        )}
      </div>
    </div>
  );
}
