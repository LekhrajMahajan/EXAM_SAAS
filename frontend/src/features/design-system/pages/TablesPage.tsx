import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable';
import { TableToolbar } from '@/shared/components/toolbar/TableToolbar';
import { GenericPagination } from '@/shared/components/pagination/GenericPagination';

export function TablesPage() {
  const dummyData = [
    { id: '1', name: 'John Doe', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', role: 'Editor', status: 'Inactive' },
    { id: '3', name: 'Alice Johnson', role: 'Viewer', status: 'Active' },
  ];

  const columns = [
    { id: 'name', header: 'Name', accessorKey: 'name' as const },
    { id: 'role', header: 'Role', accessorKey: 'role' as const },
    { 
      id: 'status', 
      header: 'Status', 
      cell: ({ row }: { row: typeof dummyData[0] }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Tables"
        description="Data presentation grids with sorting, filtering, and pagination."
      />

      <Section title="Generic Data Table">
        <ComponentPreview className="flex-col !items-stretch">
          <TableToolbar onRefresh={() => {}} onExport={() => {}} />
          <GenericDataTable 
            data={dummyData}
            columns={columns}
            keyExtractor={item => item.id}
            enableSelection
          />
          <GenericPagination 
            pageIndex={0}
            pageSize={10}
            totalCount={3}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </ComponentPreview>
      </Section>
    </div>
  );
}
