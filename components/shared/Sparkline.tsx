import React from 'react';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  width?: number;
  height?: number;
}

const colorClasses = {
  blue: 'stroke-blue-500',
  green: 'stroke-emerald-500',
  red: 'stroke-red-500',
  yellow: 'stroke-yellow-500',
  purple: 'stroke-purple-500',
};

export function Sparkline({
  data,
  className,
  color = 'blue',
  width = 80,
  height = 24,
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height} className={cn('opacity-20', className)}>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className={className}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={colorClasses[color]}
      />
    </svg>
  );
}
