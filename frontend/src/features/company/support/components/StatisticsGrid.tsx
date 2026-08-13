import React from 'react';
import type { SupportStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Ticket, Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StatisticsGridProps {
  stats: SupportStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Ticket className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.totalTickets.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Tickets</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Activity className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.openTickets + stats.inProgress}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Active Tickets</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Resolved</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.highPriority}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">High/Urgent Priority</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm md:col-span-3 lg:col-span-1">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Clock className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.avgResolutionTimeHours}h</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Avg Resolution</p>
        </CardContent>
      </Card>
    </div>
  );
}
