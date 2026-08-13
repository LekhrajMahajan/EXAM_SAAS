import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_DUTIES } from '../utils/placeholder';
import { DutyTable } from '../components/DutyTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, Download } from 'lucide-react';

export function DutyAllocationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Duty Allocation" description="Assign and manage duties for observers and invigilators across centers." />
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Allocate Duty
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Roles</option>
          <option>Observer</option>
          <option>Invigilator</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Exams</option>
          <option>SSC CGL 2026</option>
          <option>IBPS PO 2026</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Shifts</option>
          <option>Morning</option>
          <option>Afternoon</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Statuses</option>
          <option>Assigned</option>
          <option>Accepted</option>
          <option>Completed</option>
        </select>
      </div>

      <DutyTable duties={DUMMY_DUTIES} />
    </div>
  );
}
