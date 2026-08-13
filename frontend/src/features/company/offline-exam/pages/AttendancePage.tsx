import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ATTENDANCE, DUMMY_SESSIONS } from '../utils/placeholder';
import { AttendanceTable } from '../components/AttendanceTable';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

export function AttendancePage() {
  const session = DUMMY_SESSIONS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Attendance Management" description="Mark and view candidate attendance for offline exam sessions." />
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><RefreshCw className="w-4 h-4 mr-2" /> Sync</Button>
          <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-bold text-indigo-700">{session.sessionCode}</div>
            <div className="font-bold text-slate-900 mt-1">{session.exam} — {session.subject}</div>
            <div className="text-sm text-slate-500">{session.center} · {session.shift} Shift · {session.startTime}–{session.endTime}</div>
          </div>
          <StatusBadge status={session.status} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Rooms</option>
          <option>Room 101</option><option>Room 102</option><option>Room 103</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Statuses</option>
          <option>Present</option><option>Absent</option><option>Late</option><option>Not Marked</option>
        </select>
      </div>

      <AttendanceTable records={DUMMY_ATTENDANCE} />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <span className="font-bold">Note:</span> Attendance marking is performed by invigilators in each room. Sync with attendance API will be available in production.
      </div>
    </div>
  );
}
