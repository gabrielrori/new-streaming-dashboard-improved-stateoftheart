import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

interface AlertBadgeProps {
  severity: AlertSeverity;
  message?: string;
  className?: string;
}

const severityConfig: Record<
  AlertSeverity,
  { icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }
> = {
  critical: {
    icon: AlertCircle,
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

export function AlertBadge({ severity, message, className }: AlertBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {message && <span>{message}</span>}
    </div>
  );
}
