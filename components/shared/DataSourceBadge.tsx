import React from 'react';
import { cn } from '@/lib/utils';

export type DataSource = 'Video.js VHS' | 'Cloudflare Logpush' | 'CMCD/CMSD' | 'Edge State';

interface DataSourceBadgeProps {
  source: DataSource;
  className?: string;
}

const sourceColors: Record<DataSource, { bg: string; text: string; border: string }> = {
  'Video.js VHS': {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  'Cloudflare Logpush': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  'CMCD/CMSD': {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  'Edge State': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

export function DataSourceBadge({ source, className }: DataSourceBadgeProps) {
  const colors = sourceColors[source];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        'backdrop-blur-sm transition-premium',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {source}
    </span>
  );
}
