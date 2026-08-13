import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SEATS, DUMMY_SESSIONS } from '../utils/placeholder';
import { SeatingGrid } from '../components/SeatingGrid';
import { Button } from '@/shared/components/ui/button';
import { Printer } from 'lucide-react';

export function SeatingPlanPage() {
  const session = DUMMY_SESSIONS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Seating Plan" description="View room-wise seat allocations with candidate mapping for each session." />
        <Button variant="outline" className="bg-white">
          <Printer className="w-4 h-4 mr-2" /> Print Seating Plan
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div>
          <div className="font-mono text-xs font-bold text-indigo-700 mb-1">{session.sessionCode}</div>
          <div className="font-bold text-slate-900">{session.exam} — {session.subject}</div>
          <div className="text-sm text-slate-500 mt-0.5">{session.center} · {session.date} · {session.shift} Shift</div>
        </div>
      </div>

      <div className="flex gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Buildings</option>
          <option>Main Building</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Floors</option>
          <option>Ground Floor</option>
          <option>1st Floor</option>
        </select>
      </div>

      <SeatingGrid seats={DUMMY_SEATS} />
    </div>
  );
}
