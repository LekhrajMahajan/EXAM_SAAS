import React from 'react';
import type { TimelineItem } from '../../types';
import * as Icons from 'lucide-react';
import { useTheme } from '@/providers/theme-context';

export function GenericTimeline({ items, className = '' }: { items: TimelineItem[], className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item, idx) => {
        const Icon = item.icon ? (Icons as any)[item.icon] || Icons.Circle : Icons.Circle;
        
        const colors = {
          default: 'bg-slate-100 text-slate-500 border-slate-200',
          success: 'bg-secondary text-primary border-primary/20',
          warning: 'bg-warning/10 text-warning border-warning/20',
          error: 'bg-destructive/10 text-destructive border-destructive/20',
          info: 'bg-primary/10 text-primary border-primary/20',
        };

        const variant = item.status || 'default';

        return (
          <div key={item.id} className="relative flex gap-4 group">
            {idx !== items.length - 1 && (
              <div className={`absolute left-4 top-8 bottom-[-24px] w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            )}
            <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-900' : 'bg-white'} ${colors[variant]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.title}</h4>
                <span className={`text-xs font-medium whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.timestamp}</span>
              </div>
              {item.description && <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>}
              
              {item.metadata && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(item.metadata).map(([k, v]) => (
                    <div key={k} className={`inline-flex items-center px-2 py-1 rounded border text-xs ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                      <span className="font-medium mr-1">{k}:</span> {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
