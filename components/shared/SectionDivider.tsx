import React from 'react';
import { cn } from '@/lib/utils';

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn('py-16', className)}>
      <div className="border-t border-zinc-800/50" />
    </div>
  );
}
