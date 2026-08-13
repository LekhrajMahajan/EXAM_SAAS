import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceSummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  accent?: string;
}

export function FinanceSummaryCard({ title, value, subtitle, trend, accent = 'border-slate-200' }: FinanceSummaryCardProps) {
  return (
    <Card className={`shadow-sm border-l-4 ${accent}`}>
      <CardContent className="p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value} vs last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
