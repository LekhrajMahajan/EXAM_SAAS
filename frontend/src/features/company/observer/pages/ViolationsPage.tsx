import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_VIOLATIONS } from '../utils/placeholder';
import { ViolationTable } from '../components/ViolationTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, Download } from 'lucide-react';

export function ViolationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Violation Reports" description="Track candidate malpractices, UFM cases, and subsequent disciplinary actions." />
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Report Violation
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Actions</option>
          <option>Warning</option>
          <option>Dismissed</option>
          <option>Debarred</option>
          <option>Under Review</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Types</option>
          <option>Mobile Phone Possession</option>
          <option>Talking to neighbour</option>
          <option>Use of unauthorized material</option>
          <option>Impersonation</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Centers</option>
          <option>Delhi Centre 01</option>
          <option>Mumbai Centre 02</option>
        </select>
      </div>

      <ViolationTable violations={DUMMY_VIOLATIONS} />
    </div>
  );
}
