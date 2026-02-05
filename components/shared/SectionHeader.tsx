import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataSourceBadge, type DataSource } from './DataSourceBadge';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  dataSource?: DataSource;
  lastUpdated?: Date | string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  dataSource,
  lastUpdated,
  className,
}: SectionHeaderProps) {
  const formatLastUpdated = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return dateObj.toLocaleDateString();
  };

  return (
    <div className={cn('flex items-center justify-between border-b border-white/10 pb-4', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {dataSource && <DataSourceBadge source={dataSource} />}
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {formatLastUpdated(lastUpdated)}
          </span>
        )}
      </div>
    </div>
  );
}
