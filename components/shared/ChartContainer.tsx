import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartSkeleton } from './Skeleton';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  subtitle,
  isLoading = false,
  error = null,
  children,
  className,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 backdrop-blur-sm',
        className
      )}
    >
      {/* Header */}
      {!isLoading && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="relative min-h-[300px]">
        {isLoading && (
          <ChartSkeleton />
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-400">Failed to load chart</p>
                <p className="mt-1 text-xs text-gray-500">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="h-full w-full">{children}</div>
        )}
      </div>
    </div>
  );
}
