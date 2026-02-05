'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  // Real-time counter for "Last updated"
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSinceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSecondsSinceUpdate(0);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between px-6',
        'bg-gradient-to-r from-zinc-900/95 via-zinc-900/90 to-zinc-900/95 backdrop-blur-xl',
        'border-b border-white/10 shadow-lg',
        className
      )}
    >
      {/* Logo (mobile fallback) + Last Updated */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smartbit
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span>
            Last updated: <span className="font-medium text-zinc-300">{secondsSinceUpdate}s ago</span>
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-400" />
          <div className="flex items-center gap-1 rounded-lg bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-white/10 p-1 shadow-inner">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300',
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 hover:scale-105'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300',
            'bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-white/10',
            'text-zinc-300 hover:text-zinc-100 hover:border-white/20 hover:shadow-lg hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* User Avatar Placeholder */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20">
          <User className="h-5 w-5 text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
