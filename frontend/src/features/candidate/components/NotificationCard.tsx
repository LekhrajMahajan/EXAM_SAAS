import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { NotificationRecord } from '../types';
import { Bell, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NotificationCardProps {
  notification: NotificationRecord;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  
  const getIcon = () => {
    switch(notification.type) {
      case 'Info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'Alert': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <Card className={cn("border-slate-200 shadow-sm transition-colors", !notification.isRead && "bg-blue-50/50 border-blue-100")}>
      <CardContent className="p-4 sm:p-6 flex gap-4 items-start">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h4 className={cn("text-base font-semibold", !notification.isRead ? "text-slate-900" : "text-slate-700")}>
              {notification.title}
            </h4>
            <span className="text-xs text-slate-500 whitespace-nowrap">{notification.date}</span>
          </div>
          <p className="text-sm text-slate-600">{notification.message}</p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
        )}
      </CardContent>
    </Card>
  );
}
