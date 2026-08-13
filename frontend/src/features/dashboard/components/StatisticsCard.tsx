import React from 'react';
import type { StatItem } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import * as Icons from 'lucide-react';

export function StatisticsCard({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = (Icons as any)[stat.iconName] || Icons.Activity;
        
        const colors = {
          indigo: 'bg-indigo-50 text-indigo-600',
          emerald: 'bg-emerald-50 text-emerald-600',
          amber: 'bg-amber-50 text-amber-600',
          rose: 'bg-rose-50 text-rose-600',
          sky: 'bg-sky-50 text-sky-600',
          violet: 'bg-violet-50 text-violet-600',
          slate: 'bg-slate-50 text-slate-600',
        };

        const trendColors = {
          up: 'text-emerald-500',
          down: 'text-rose-500',
          neutral: 'text-slate-400'
        };

        return (
          <Card key={stat.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                {stat.change && (
                  <p className={`text-xs mt-2 font-medium ${trendColors[stat.trend || 'neutral']}`}>
                    {stat.trend === 'up' && '↑ '}
                    {stat.trend === 'down' && '↓ '}
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colors[stat.colorScheme]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
