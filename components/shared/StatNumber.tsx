'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from './Sparkline';

interface StatNumberProps {
  value: number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  className?: string;
  valueClassName?: string;
  animate?: boolean;
  duration?: number;
  sparklineData?: number[];
  sparklineColor?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

/**
 * Large animated number display with CountUp-style animation on mount.
 * 
 * Features:
 * - Smooth count-up animation from 0 to target value
 * - Delta indicator with arrow and color (green up, red down)
 * - Unit label styling
 * - Optional sparkline visualization
 * - Customizable animation duration
 */
export function StatNumber({
  value,
  unit,
  delta,
  deltaLabel = 'vs previous',
  className,
  valueClassName,
  animate = true,
  duration = 1000,
  sparklineData,
  sparklineColor = 'blue',
}: StatNumberProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!animate || hasAnimated) {
      setDisplayValue(value);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;
    const change = endValue - startValue;

    const animationFrame = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + change * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animationFrame);
      } else {
        setHasAnimated(true);
      }
    };

    requestAnimationFrame(animationFrame);
  }, [value, animate, duration, hasAnimated]);

  // Format display value
  const formatValue = (val: number): string => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(2) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    } else if (val < 10) {
      return val.toFixed(2);
    } else {
      return val.toFixed(0);
    }
  };

  // Determine delta styling
  const DeltaIcon = delta === undefined ? Minus : delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const deltaColor =
    delta === undefined
      ? 'text-zinc-500'
      : delta > 0
      ? 'text-emerald-400'
      : delta < 0
      ? 'text-rose-400'
      : 'text-zinc-500';

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Main Value */}
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'text-4xl font-bold tracking-tight transition-all duration-300',
            valueClassName || 'text-zinc-100'
          )}
        >
          {formatValue(displayValue)}
        </span>
        {unit && (
          <span className="text-xl font-medium text-zinc-500">
            {unit}
          </span>
        )}
      </div>

      {/* Delta & Sparkline Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Delta Indicator */}
        {delta !== undefined && (
          <div className="flex items-center gap-1.5">
            <DeltaIcon className={cn('h-4 w-4', deltaColor)} />
            <span className={cn('text-sm font-semibold', deltaColor)}>
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1)}%
            </span>
            <span className="text-xs text-zinc-500">
              {deltaLabel}
            </span>
          </div>
        )}

        {/* Optional Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="flex-shrink-0">
            <Sparkline
              data={sparklineData}
              color={sparklineColor}
              width={100}
              height={32}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simplified stat display without animation (for static contexts)
 */
export function StatNumberStatic({
  value,
  unit,
  className,
  valueClassName,
}: Pick<StatNumberProps, 'value' | 'unit' | 'className' | 'valueClassName'>) {
  const formatValue = (val: number): string => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(2) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    } else {
      return val.toFixed(0);
    }
  };

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span
        className={cn(
          'text-4xl font-bold tracking-tight',
          valueClassName || 'text-zinc-100'
        )}
      >
        {formatValue(value)}
      </span>
      {unit && (
        <span className="text-xl font-medium text-zinc-500">
          {unit}
        </span>
      )}
    </div>
  );
}
