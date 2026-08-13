import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Info } from 'lucide-react';

interface SharedCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export function BaseCard({ title, children, className = '' }: SharedCardProps) {
  return (
    <Card className={`border-slate-200 shadow-sm ${className}`}>
      <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-sm font-bold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

export function InfoCard({ title, description, icon: Icon = Info }: { title: string, description: string, icon?: React.ElementType }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, trend, trendValue }: { label: string, value: string | number, trend?: 'up' | 'down', trendValue?: string }) {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
      <p className="text-sm font-medium text-slate-500 mb-2">{label}</p>
      <div className="flex items-end gap-3">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && trendValue && (
          <span className={`text-xs font-medium mb-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
