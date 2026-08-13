import React from 'react';
import { DeveloperCard, StatisticsGrid } from '../components/DeveloperComponents';
import { Route, Database, Shield, LayoutTemplate, Box, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockHealth, mockBuildInfo } from '../utils/placeholders';
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable';
import { Button } from '@/shared/components/ui/button';

export function DeveloperDashboard() {
  const stats = [
    { label: 'Total Routes', value: '45', icon: Route, colorClass: 'bg-indigo-100 text-indigo-600' },
    { label: 'API Endpoints', value: '128', icon: Database, colorClass: 'bg-emerald-100 text-emerald-600' },
    { label: 'Shared Components', value: '56', icon: Box, colorClass: 'bg-amber-100 text-amber-600' },
    { label: 'Security Roles', value: '8', icon: Shield, colorClass: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Developer Dashboard</h1>
          <p className="text-sm text-slate-500">System infrastructure and diagnostics overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{mockBuildInfo.version}</p>
            <p className="text-xs text-slate-500">{mockBuildInfo.environment}</p>
          </div>
        </div>
      </div>

      <StatisticsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeveloperCard 
          title="System Health Overview" 
          action={<Button size="sm" variant="outline">Run Diagnostics</Button>}
        >
          <GenericDataTable 
            data={mockHealth.slice(0, 4)}
            columns={[
              { id: 'service', header: 'Service', accessorKey: 'service' },
              { 
                id: 'status', 
                header: 'Status', 
                cell: ({ row }) => (
                  <span className={`flex items-center gap-1 text-xs font-medium ${row.status === 'operational' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {row.status === 'operational' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                )
              },
              { id: 'latency', header: 'Latency', accessorKey: 'latency' }
            ]}
          />
        </DeveloperCard>

        <DeveloperCard title="Build Information">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Version</p>
                <p className="text-sm font-bold text-slate-900">{mockBuildInfo.version}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Build Number</p>
                <p className="text-sm font-bold text-slate-900">{mockBuildInfo.buildNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Git Commit</p>
                <p className="text-sm font-mono text-slate-900">{mockBuildInfo.commit.substring(0, 7)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Branch</p>
                <p className="text-sm font-bold text-slate-900">{mockBuildInfo.branch}</p>
              </div>
            </div>
          </div>
        </DeveloperCard>
      </div>
    </div>
  );
}
