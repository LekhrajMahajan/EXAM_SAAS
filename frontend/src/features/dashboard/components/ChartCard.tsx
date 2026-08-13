import React from 'react';
import { WidgetCard } from './WidgetCard';
import type { ChartData } from '../types';
import { BarChart3, PieChart, LineChart } from 'lucide-react';

export function ChartCard({ data }: { data: ChartData }) {
  // Placeholder rendering for charts since real chart integration is skipped
  const getIcon = () => {
    switch(data.type) {
      case 'bar': return <BarChart3 className="w-16 h-16 text-slate-200" />;
      case 'pie': 
      case 'doughnut': return <PieChart className="w-16 h-16 text-slate-200" />;
      case 'line': return <LineChart className="w-16 h-16 text-slate-200" />;
      default: return <BarChart3 className="w-16 h-16 text-slate-200" />;
    }
  };

  return (
    <WidgetCard title={data.title}>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
        {getIcon()}
        <p className="mt-4 text-sm font-medium text-slate-400">Chart Visualization Placeholder</p>
        <p className="text-xs text-slate-400">{data.type.toUpperCase()} CHART • {data.labels.length} Data Points</p>
      </div>
    </WidgetCard>
  );
}
