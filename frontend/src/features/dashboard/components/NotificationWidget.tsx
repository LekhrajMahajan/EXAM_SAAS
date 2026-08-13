import React from 'react';
import type { NotificationItem } from '../types';
import { WidgetCard } from './WidgetCard';
import { Bell, ShieldAlert, Info, AlertTriangle } from 'lucide-react';

export function NotificationWidget({ notifications }: { notifications: NotificationItem[] }) {
  const getIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <WidgetCard title="Notifications" action={<Bell className="w-4 h-4 text-slate-400" />}>
      <div className="space-y-0">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
            <div className="flex gap-3">
              <div className="mt-0.5">{getIcon(notif.priority)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-0.5">
                  <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
              </div>
              {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />}
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
