import React from 'react';
import type { ObserverStats } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Users, UserSquare2, Briefcase, UserCheck, UserX, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function StatisticsGrid({ stats }: { stats: ObserverStats }) {
  const cards = [
    { label: 'Observers', value: stats.totalObservers, icon: UserSquare2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Invigilators', value: stats.totalInvigilators, icon: Users, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: "Today's Duties", value: stats.todayDuties, icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Present Staff', value: stats.presentStaff, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Absent Staff', value: stats.absentStaff, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Active Incidents', value: stats.activeIncidents, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Violations', value: stats.violationReports, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Completed', value: stats.completedDuties, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
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
