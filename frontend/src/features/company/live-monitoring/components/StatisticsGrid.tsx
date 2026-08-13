import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Users, ServerOff, AlertTriangle, MonitorPlay, Wifi, Activity } from 'lucide-react';
import type { MonitoringStats } from '../types';

interface StatisticsGridProps {
  stats: MonitoringStats;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Exams</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeExams}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <MonitorPlay className="w-6 h-6 text-indigo-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Live Candidates</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeCandidates}</p>
            <p className="text-xs text-slate-400 mt-1">{stats.completedCandidates} Completed</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Violations</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.violations}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Disconnected</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.disconnectedCandidates}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <ServerOff className="w-6 h-6 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
