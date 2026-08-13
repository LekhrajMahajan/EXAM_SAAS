import React from 'react';
import type { OfflineExamStats } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CalendarClock, Play, CheckCircle2, Users, UserX, ScanLine, CheckCheck, ClipboardList } from 'lucide-react';

export function StatisticsGrid({ stats }: { stats: OfflineExamStats }) {
  const cards = [
    { label: 'Scheduled Exams', value: stats.scheduledExams, icon: CalendarClock, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Running Exams', value: stats.runningExams, icon: Play, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Completed', value: stats.completedExams, icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Present', value: stats.presentCandidates.toLocaleString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Absent', value: stats.absentCandidates.toLocaleString(), icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'OMR Pending', value: stats.omrPending.toLocaleString(), icon: ScanLine, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'OMR Processed', value: stats.omrProcessed.toLocaleString(), icon: CheckCheck, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Eval Pending', value: stats.evaluationPending.toLocaleString(), icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-2`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase leading-tight">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
