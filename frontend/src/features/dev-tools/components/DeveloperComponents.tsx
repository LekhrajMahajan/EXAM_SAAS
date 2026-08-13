import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';

export function DeveloperCard({ title, children, action, className = '' }: { title: string, children: React.ReactNode, action?: React.ReactNode, className?: string }) {
  return (
    <Card className={`border-slate-200 shadow-sm ${className}`}>
      <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-800">{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function StatisticsGrid({ stats }: { stats: { label: string, value: string | number, icon: any, colorClass: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
