import React from 'react';
import { WidgetCard } from './WidgetCard';
import { ChevronRight } from 'lucide-react';

interface SummaryItem {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}

export function SummaryCard({ title, items, icon: Icon, viewAllPath }: { title: string, items: SummaryItem[], icon?: any, viewAllPath?: string }) {
  return (
    <WidgetCard title={title} action={icon && <Icon className="w-4 h-4 text-slate-400" />}>
      <div className="space-y-3 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-2 rounded hover:bg-slate-50 transition-colors">
            <span className="text-sm font-medium text-slate-600">{item.label}</span>
            <div className="text-right">
              <span className={`text-sm font-bold ${item.color || 'text-slate-900'}`}>{item.value}</span>
              {item.subValue && <div className="text-[10px] font-medium text-slate-400">{item.subValue}</div>}
            </div>
          </div>
        ))}
      </div>
      {viewAllPath && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button className="w-full flex items-center justify-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            View Details <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      )}
    </WidgetCard>
  );
}
