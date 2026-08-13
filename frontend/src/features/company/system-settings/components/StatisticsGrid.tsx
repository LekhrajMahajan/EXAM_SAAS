import React from 'react';
import type { SettingsStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Settings2, Plug, ServerCog, AlertCircle } from 'lucide-react';

interface StatisticsGridProps {
  stats: SettingsStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
             <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalSettings}</p>
            <p className="text-xs font-medium text-slate-500">Configured Settings</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
             <Plug className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.activeIntegrations}</p>
            <p className="text-xs font-medium text-slate-500">Active Integrations</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
             <ServerCog className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.configuredServices}</p>
            <p className="text-xs font-medium text-slate-500">Connected Services</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
             <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.pendingChanges}</p>
            <p className="text-xs font-medium text-slate-500">Pending Changes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
