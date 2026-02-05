'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  Zap,
  Signal,
  MapPin,
  AlertTriangle,
  Globe,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Audience', href: '/audience', icon: Users },
  { name: 'Playback Quality', href: '/playback', icon: PlayCircle },
  { name: 'Performance', href: '/performance', icon: Zap },
  { name: 'CDN & Delivery', href: '/cdn', icon: Signal },
  { name: 'Geographic', href: '/geographic', icon: MapPin },
  { name: 'Errors & Alerts', href: '/errors', icon: AlertTriangle },
  { name: 'Edge State', href: '/edge', icon: Globe },
  { name: 'Business Metrics', href: '/business', icon: TrendingUp },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-md border border-white/20 shadow-lg text-zinc-300 hover:text-zinc-100 transition-all hover:scale-105"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Glass Effect */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 flex h-screen flex-col transition-all duration-300',
          'bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 backdrop-blur-xl',
          'border-r border-white/10 shadow-2xl',
          collapsed ? 'w-16' : 'w-64',
          // Mobile: slide in/out
          'lg:sticky lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 bg-gradient-to-r from-zinc-800/50 to-transparent">
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smartbit
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-all hover:scale-110 hidden lg:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/10 text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-500/30 backdrop-blur-sm'
                    : 'text-zinc-400 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 hover:text-zinc-200 hover:border hover:border-white/10',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110',
                    isActive && 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                  )}
                />
                {!collapsed && (
                  <span className="transition-all duration-300">
                    {item.name}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-500/50"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-white/10 p-4 bg-gradient-to-t from-zinc-900/80 to-transparent backdrop-blur-sm">
            <div className="text-xs text-zinc-500">
              <p className="font-medium text-zinc-400">Streaming Dashboard</p>
              <p className="mt-1">v1.0.0 · Premium</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
