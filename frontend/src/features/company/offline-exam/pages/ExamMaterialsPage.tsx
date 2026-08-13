import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_MATERIALS } from '../utils/placeholder';
import { MaterialCard } from '../components/MaterialCard';
import { Button } from '@/shared/components/ui/button';
import { Package } from 'lucide-react';

export function ExamMaterialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Exam Materials" description="Track question paper packets, OMR sheets, and answer booklets distribution and return." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Package className="w-4 h-4 mr-2" /> Manage Distribution
        </Button>
      </div>

      <div className="flex gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Sessions</option>
          <option>SESS-2026-1020-AM</option>
          <option>SESS-2026-1020-PM</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Types</option>
          <option>Question Paper</option>
          <option>OMR Sheet</option>
          <option>Answer Booklet</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_MATERIALS.map(m => <MaterialCard key={m.id} material={m} />)}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
        <span className="font-bold">Future Integration:</span> Barcode/QR scanning for packet tracking will be available via the File Management and Audit Logs modules.
      </div>
    </div>
  );
}
