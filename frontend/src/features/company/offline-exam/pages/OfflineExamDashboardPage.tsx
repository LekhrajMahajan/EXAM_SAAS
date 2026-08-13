import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_OFFLINE_STATS, DUMMY_SESSIONS } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OfflineExamDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Offline Examination Management" description="Monitor all physical exam sessions, attendance, OMR processing, and evaluations." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
          <Link to="/company/offline-exam/sessions"><Plus className="w-4 h-4 mr-2" /> New Session</Link>
        </Button>
      </div>

      <StatisticsGrid stats={DUMMY_OFFLINE_STATS} />

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900">Today's Sessions</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
            <Link to="/company/offline-exam/sessions">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Session Code</th>
                  <th className="px-4 py-3 font-semibold">Exam / Subject</th>
                  <th className="px-4 py-3 font-semibold">Center</th>
                  <th className="px-4 py-3 font-semibold">Shift</th>
                  <th className="px-4 py-3 font-semibold text-center">Candidates</th>
                  <th className="px-4 py-3 font-semibold text-center">Present</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_SESSIONS.map(s => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-700">{s.sessionCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{s.exam}</div>
                      <div className="text-xs text-slate-500">{s.subject}</div>
                    </td>
                    <td className="px-4 py-3">{s.center}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.shift}</div>
                      <div className="text-xs text-slate-400">{s.startTime} – {s.endTime}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">{s.totalCandidates}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">{s.presentCount || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center"><StatusBadge status={s.status} /></div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600 text-xs" asChild>
                        <Link to="/company/offline-exam/attendance">Attendance</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
