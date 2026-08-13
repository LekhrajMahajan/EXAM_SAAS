import React from 'react';
import type { ActivityItem } from '../types';
import { WidgetCard } from './WidgetCard';
import * as Icons from 'lucide-react';

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <WidgetCard title="Recent Activities" action={<button className="text-xs text-indigo-600 font-medium">View All</button>}>
      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = activity.iconName ? (Icons as any)[activity.iconName] || Icons.Activity : Icons.Activity;
          
          const typeColors = {
            info: 'bg-sky-50 text-sky-600 border-sky-100',
            success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            warning: 'bg-amber-50 text-amber-600 border-amber-100',
            error: 'bg-rose-50 text-rose-600 border-rose-100',
          };

          return (
            <div key={activity.id} className="relative flex gap-4 group">
              {idx !== activities.length - 1 && (
                <div className="absolute left-4 top-8 bottom-[-16px] w-px bg-slate-100 group-hover:bg-slate-200 transition-colors" />
              )}
              <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 bg-white ${typeColors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex justify-between items-start gap-2 mb-0.5">
                  <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{activity.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
