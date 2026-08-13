import { type FC } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import * as Icons from 'lucide-react';
import type { StatItem } from '../types';

type LucideIcon = FC<{ className?: string }>;
const IconsMap = Icons as unknown as Record<string, LucideIcon>;

const COLOR_MAP: Record<string, { icon: string; value: string; badge: string; border: string }> = {
  indigo: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
  },
  emerald: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-900',
  },
  amber: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-amber-50 text-amber-600',
    border: 'border-amber-200 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-900',
  },
  rose: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-rose-50 text-rose-600',
    border: 'border-rose-200 dark:border-rose-900/50 hover:border-rose-300 dark:hover:border-rose-900',
  },
  sky: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-sky-50 text-sky-600',
    border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
  },
  violet: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-violet-50 text-violet-600',
    border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
  },
  slate: {
    icon: 'bg-[#E4FD97] text-[#2D3E2C]',
    value: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-slate-50 text-slate-600',
    border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
  },
};

interface LiveStatsGridProps {
  stats: StatItem[];
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <Card className="border-slate-200 animate-pulse">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-7 w-16 bg-slate-200 rounded" />
            <div className="h-2.5 w-20 bg-slate-100 rounded" />
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-200" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveStatsGrid({ stats, isLoading = false }: LiveStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = IconsMap[stat.iconName] || Icons.Activity as unknown as LucideIcon;
        const scheme = COLOR_MAP[stat.colorScheme] || COLOR_MAP.slate;

        const trendColor =
          stat.trend === 'up' ? 'text-emerald-500' :
          stat.trend === 'down' ? 'text-rose-500' :
          'text-slate-400';

        const trendPrefix =
          stat.trend === 'up' ? '↑ ' :
          stat.trend === 'down' ? '↓ ' : '';

        return (
          <Card
            key={stat.id}
            className={`border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${scheme.border}`}
          >
            <CardContent className="p-5 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 truncate">
                  {stat.label}
                </p>
                <h3 className={`text-2xl font-bold mb-1 ${scheme.value}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </h3>
                {stat.change && (
                  <p className={`text-[11px] font-medium ${trendColor}`}>
                    {trendPrefix}{stat.change}
                  </p>
                )}
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${scheme.icon}`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
