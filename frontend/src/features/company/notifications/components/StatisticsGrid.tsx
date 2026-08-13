import React from 'react';
import type { NotificationStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Bell, Inbox, Clock, Send, XCircle } from 'lucide-react';

interface StatisticsGridProps {
  stats: NotificationStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Bell className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.totalNotifications.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Broadcasts</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Inbox className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.unreadNotifications.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Unread In-App</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Clock className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.scheduledNotifications.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Scheduled Pending</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Send className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.deliveredNotifications.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Successfully Delivered</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <XCircle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.failedNotifications.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Failed Deliveries</p>
        </CardContent>
      </Card>
    </div>
  );
}
