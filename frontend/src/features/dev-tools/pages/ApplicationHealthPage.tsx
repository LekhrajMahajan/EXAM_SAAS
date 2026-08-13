import React from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';
import { mockHealth } from '../utils/placeholders';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable';
import { Button } from '@/shared/components/ui/button';

export function ApplicationHealthPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'outage': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  const columns = [
    { id: 'service', header: 'Service Name', accessorKey: 'service' },
    { 
      id: 'status', 
      header: 'Status', 
      cell: ({ row }: { row: typeof mockHealth[0] }) => (
        <span className="flex items-center gap-2 font-medium capitalize text-slate-700">
          {getStatusIcon(row.status)}
          {row.status}
        </span>
      )
    },
    { 
      id: 'latency', 
      header: 'Latency', 
      cell: ({ row }: { row: typeof mockHealth[0] }) => (
        <span className="font-mono text-xs text-slate-600">{row.latency}</span>
      )
    },
    { 
      id: 'uptime', 
      header: 'Uptime (30d)', 
      cell: ({ row }: { row: typeof mockHealth[0] }) => (
        <span className="text-emerald-600 font-medium">{row.uptime}</span>
      )
    },
    { id: 'lastChecked', header: 'Last Checked', accessorKey: 'lastChecked' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Health</h1>
          <p className="text-sm text-slate-500">Service status and uptime monitoring placeholders.</p>
        </div>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
          Run Full Diagnostic
        </Button>
      </div>

      <DeveloperCard title="Dependent Services">
        <GenericDataTable 
          data={mockHealth}
          columns={columns as any}
          keyExtractor={item => item.service}
        />
      </DeveloperCard>
    </div>
  );
}
