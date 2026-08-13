import React from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';
import { mockApis } from '../utils/placeholders';
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable';
import { TableToolbar } from '@/shared/components/toolbar/TableToolbar';
import { Badge } from '@/shared/components/ui/badge';

export function ApiExplorerPage() {
  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-sky-100 text-sky-700';
      case 'POST': return 'bg-emerald-100 text-emerald-700';
      case 'PUT': return 'bg-amber-100 text-amber-700';
      case 'DELETE': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const columns = [
    { 
      id: 'method', 
      header: 'Method', 
      cell: ({ row }: { row: typeof mockApis[0] }) => (
        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${getMethodColor(row.method)}`}>
          {row.method}
        </span>
      )
    },
    { 
      id: 'path', 
      header: 'Endpoint Path', 
      cell: ({ row }: { row: typeof mockApis[0] }) => (
        <span className="font-mono text-xs text-slate-700">{row.path}</span>
      )
    },
    { id: 'module', header: 'Module', accessorKey: 'module' },
    { 
      id: 'status', 
      header: 'Status', 
      cell: ({ row }: { row: typeof mockApis[0] }) => (
        <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className={row.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
          {row.status}
        </Badge>
      )
    },
    { id: 'description', header: 'Description', accessorKey: 'description' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">API Explorer</h1>
        <p className="text-sm text-slate-500">Internal registry of all backend endpoints.</p>
      </div>

      <DeveloperCard title="Endpoint Registry">
        <div className="p-4 border-b border-slate-100">
          <TableToolbar onRefresh={() => {}} />
        </div>
        <GenericDataTable 
          data={mockApis}
          columns={columns as any}
          keyExtractor={item => item.id}
        />
      </DeveloperCard>
    </div>
  );
}
