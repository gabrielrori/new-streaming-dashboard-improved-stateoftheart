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
        'flex h-16 items-center justify-between border-b border-white/10 bg-gray-900/50 px-6 backdrop-blur-sm',
        className
      )}
    >
      {/* Logo (mobile fallback) + Last Updated */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smartbit
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>
            Last updated: <span className="font-medium text-gray-300">{secondsSinceUpdate}s ago</span>
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-gray-800/50 p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
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
            'flex items-center gap-2 rounded-lg border border-white/10 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/5 hover:text-gray-200 disabled:opacity-50',
            isRefreshing && 'cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* User Avatar Placeholder */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <User className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
