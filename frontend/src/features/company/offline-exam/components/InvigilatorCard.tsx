import React from 'react';
import type { Invigilator } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { User, MapPin, Clock, BadgeCheck } from 'lucide-react';

export function InvigilatorCard({ invigilator }: { invigilator: Invigilator }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 truncate">{invigilator.name}</div>
            <div className="text-xs text-slate-500">{invigilator.designation}</div>
            <div className="font-mono text-[10px] text-indigo-600 mt-0.5">{invigilator.employeeId}</div>
          </div>
          <StatusBadge status={invigilator.dutyStatus} />
        </div>

        <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-800">{invigilator.room}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Report Time: <span className="font-bold text-slate-800">{invigilator.reportTime}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
