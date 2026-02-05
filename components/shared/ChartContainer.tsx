import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartSkeleton } from './Skeleton';
import { GlassCard } from './GlassCard';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function ChartContainer({
  title,
  subtitle,
  isLoading = false,
  error = null,
  children,
  className,
  animate = false,
}: ChartContainerProps) {
  return (
    <GlassCard
      status={error ? 'error' : 'neutral'}
      hover={false}
      animate={animate}
      className={cn('p-6', className)}
    >
      {/* Header */}
      {!isLoading && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          {subtitle && <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="relative min-h-[300px]">
        {isLoading && <ChartSkeleton />}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-900/80 backdrop-blur-md">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-10 w-10 text-rose-400" />
              <div>
                <p className="text-sm font-semibold text-rose-400">Failed to load chart</p>
                <p className="mt-1.5 text-xs text-zinc-500">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && <div className="h-full w-full">{children}</div>}
      </div>
    </GlassCard>
  );
}
