import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  status?: StatusType;
  hover?: boolean;
  animate?: boolean;
}

const statusStyles: Record<StatusType, string> = {
  success: 'glass-card-success',
  warning: 'glass-card-warning',
  error: 'glass-card-error',
  info: 'glass-card-info',
  neutral: '',
};

/**
 * Premium glassmorphism card component with subtle backdrop blur,
 * transparent background, and colored glow effects on hover.
 * 
 * Features:
 * - Glassmorphism effect with backdrop-blur
 * - Status-based colored glow on hover
 * - Smooth transition animations
 * - Optional slide-up animation on mount
 */
export function GlassCard({
  children,
  className,
  status = 'neutral',
  hover = true,
  animate = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base glass effect
        'glass-card',
        'rounded-lg',
        // Hover effects
        hover && 'card-hover cursor-pointer',
        // Status-specific glow
        statusStyles[status],
        // Optional animation
        animate && 'slide-up',
        // Custom classes
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * GlassCard with padding included for common use cases
 */
export function GlassCardPadded({
  children,
  className,
  status = 'neutral',
  hover = true,
  animate = false,
  padding = 'default',
}: GlassCardProps & { padding?: 'sm' | 'default' | 'lg' }) {
  const paddingClasses = {
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <GlassCard
      status={status}
      hover={hover}
      animate={animate}
      className={cn(paddingClasses[padding], className)}
    >
      {children}
    </GlassCard>
  );
}
