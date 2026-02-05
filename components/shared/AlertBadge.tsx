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
  { icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string; shadow: string }
> = {
  critical: {
    icon: AlertCircle,
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    shadow: 'shadow-glow-rose-sm',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    shadow: 'shadow-glow-amber-sm',
  },
  info: {
    icon: Info,
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    shadow: 'shadow-glow-blue-sm',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    shadow: 'shadow-glow-sm',
  },
};

export function AlertBadge({ severity, message, className }: AlertBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium',
        'transition-premium backdrop-blur-sm',
        config.bg,
        config.text,
        config.border,
        'hover:' + config.shadow,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {message && <span>{message}</span>}
    </div>
  );
}
