import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ATTENDANCE } from '../utils/placeholder';
import { AttendanceCard } from '../components/AttendanceCard';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';

export function DutyAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Staff Attendance" description="Monitor real-time check-ins and check-outs for assigned exam staff." />
        <Button variant="outline" className="bg-white">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="date" defaultValue="2026-10-20" className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" />
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Centers</option>
          <option>Delhi Centre 01</option>
          <option>Mumbai Centre 02</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Statuses</option>
          <option>Checked In</option>
          <option>Checked Out</option>
          <option>Absent</option>
          <option>Pending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DUMMY_ATTENDANCE.map(att => <AttendanceCard key={att.id} record={att} />)}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
        <span className="font-bold">Integration Note:</span> This module expects attendance events to be triggered via mobile app check-ins or biometric API integrations in the future.
      </div>
    </div>
  );
}
