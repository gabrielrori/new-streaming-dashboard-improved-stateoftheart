'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type TimeRange = '15m' | '1h' | '6h' | '24h' | '7d';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: '15m', label: 'Last 15m' },
  { value: '1h', label: 'Last 1h' },
  { value: '6h', label: 'Last 6h' },
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Last 7d' },
];

export function TimeRangeSelector({
  value,
  onChange,
  className,
}: TimeRangeSelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/70 p-1 backdrop-blur-md',
        className
      )}
    >
      {timeRangeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-premium',
            value === option.value
              ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-glow-md'
              : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
