import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_OBSERVER_STATS, DUMMY_DUTIES, DUMMY_ATTENDANCE } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { DutyTable } from '../components/DutyTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ObserverDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Observer & Invigilator Dashboard" description="Manage exam staff, allocate duties, and track attendance & incidents in real-time." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
          <Link to="/company/observer/duty-allocation"><Plus className="w-4 h-4 mr-2" /> Allocate Duty</Link>
        </Button>
      </div>

      <StatisticsGrid stats={DUMMY_OBSERVER_STATS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-base font-bold text-slate-900">Today's Duty Allocations</h3>
            <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
              <Link to="/company/observer/duty-allocation">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <DutyTable duties={DUMMY_DUTIES.slice(0, 3)} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-base font-bold text-slate-900">Recent Attendance</h3>
            <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
              <Link to="/company/observer/attendance">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            {DUMMY_ATTENDANCE.slice(0, 4).map(att => (
              <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{att.staffName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{att.location || 'Pending Location'}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    att.status === 'Checked In' ? 'bg-emerald-100 text-emerald-700' :
                    att.status === 'Checked Out' ? 'bg-indigo-100 text-indigo-700' :
                    att.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {att.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{att.checkInTime || '--:--'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
