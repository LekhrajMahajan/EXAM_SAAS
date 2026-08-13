import React from 'react';
import type { DutyAttendance } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Clock, MapPin } from 'lucide-react';

export function AttendanceCard({ record }: { record: DutyAttendance }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-slate-900">{record.staffName}</h3>
            <div className="text-xs text-slate-500 mt-0.5">{new Date(record.date).toLocaleDateString()} · {record.shift}</div>
          </div>
          <StatusBadge status={record.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Check In</div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              {record.checkInTime || '--:--'}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Check Out</div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              {record.checkOutTime || '--:--'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[150px]">{record.location || 'Unknown Location'}</span>
          </div>
          <div className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
            {record.workingHours ? `${record.workingHours} hrs` : '-- hrs'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
