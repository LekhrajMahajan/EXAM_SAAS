import React from 'react';
import type { AuditStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Database, CalendarCheck, ShieldAlert, KeyRound, Server } from 'lucide-react';

interface StatisticsGridProps {
  stats: AuditStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Database className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{(stats.totalLogs / 1000000).toFixed(1)}M</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Records</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <CalendarCheck className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.todayEvents.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Events Today</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <KeyRound className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.failedLogins.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Failed Logins (24h)</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.securityIncidents}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Security Incidents</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Server className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.apiRequests.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">API Req (24h)</p>
        </CardContent>
      </Card>
    </div>
  );
}
