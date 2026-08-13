import React from 'react';
import type { StaffPerformance } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Star, ShieldCheck, AlertTriangle } from 'lucide-react';

export function PerformanceCard({ perf }: { perf: StaffPerformance }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-slate-900">{perf.staffName}</h3>
            <div className="text-xs text-indigo-600 font-medium mt-0.5">{perf.role}</div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100 font-bold">
            {perf.overallScore} <Star className="w-3.5 h-3.5 fill-emerald-600" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Duties Completion</span>
            <span className="font-bold text-slate-700">{perf.dutiesCompleted} / {perf.dutiesAssigned}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Attendance Rate</span>
            <span className={`font-bold ${perf.attendanceRate > 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {perf.attendanceRate}%
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <div className="flex flex-col items-center flex-1 border-r border-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
              <span className="text-lg font-bold text-slate-800">{perf.incidentsReported}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Reported</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-lg font-bold text-slate-800">{perf.incidentsResolved}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Resolved</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
