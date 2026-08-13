import React from 'react';
import type { NotificationRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { NotificationBadge } from './NotificationBadge';
import { Mail, Smartphone, Bell, LayoutDashboard } from 'lucide-react';

export function NotificationCard({ notification }: { notification: NotificationRecord }) {
  
  const getIcon = (method: string) => {
    switch(method) {
      case 'Email': return <Mail className="w-3 h-3" />;
      case 'SMS': return <Smartphone className="w-3 h-3" />;
      case 'Push': return <Bell className="w-3 h-3" />;
      case 'In-App': return <LayoutDashboard className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Card className={`border-l-4 ${notification.priority === 'Urgent' ? 'border-l-red-500' : notification.priority === 'High' ? 'border-l-amber-500' : 'border-l-blue-500'} border-t-slate-200 border-r-slate-200 border-b-slate-200 shadow-sm hover:shadow-md transition-shadow`}>
       <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
             <h4 className="font-bold text-slate-900">{notification.title}</h4>
             <span className="text-xs text-slate-500 font-mono">{notification.createdDate}</span>
          </div>
          
          <p className="text-sm text-slate-600 mb-4">{notification.description}</p>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
             <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Via:</span>
                <div className="flex gap-1">
                  {notification.methods.map(m => (
                    <span key={m} className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded text-slate-600 border border-slate-200" title={m}>
                       {getIcon(m)}
                    </span>
                  ))}
                </div>
             </div>
             <NotificationBadge type="status" value={notification.status} />
          </div>
       </CardContent>
    </Card>
  );
}
