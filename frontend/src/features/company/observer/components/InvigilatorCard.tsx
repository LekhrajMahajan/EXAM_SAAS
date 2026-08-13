import React from 'react';
import type { StaffProfile } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Users, Mail, Phone, MapPin, Star } from 'lucide-react';

export function InvigilatorCard({ invigilator }: { invigilator: StaffProfile }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-sky-300 transition-all group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{invigilator.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[9px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-bold">{invigilator.employeeId}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={invigilator.status} />
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 mb-4 ml-13">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{invigilator.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{invigilator.phone}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          {invigilator.assignedCenter ? (
            <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-500 mt-0.5 flex-shrink-0" />
              <span className="truncate">{invigilator.assignedCenter}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No center assigned</div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-center flex-1 border-r border-slate-200">
            <div className="text-xs font-bold text-slate-900">{invigilator.totalDuties}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">Duties</div>
          </div>
          <div className="text-center flex-1 border-r border-slate-200">
            <div className="text-xs font-bold text-emerald-600">{invigilator.performanceScore}/10</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">Score</div>
          </div>
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
              {invigilator.rating} <Star className="w-3 h-3 fill-amber-500" />
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
