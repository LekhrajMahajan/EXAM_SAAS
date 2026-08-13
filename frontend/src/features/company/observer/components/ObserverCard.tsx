import React from 'react';
import type { StaffProfile } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { UserSquare2, Mail, Phone, MapPin, Building2, Star } from 'lucide-react';

export function ObserverCard({ observer }: { observer: StaffProfile }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <UserSquare2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{observer.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">{observer.employeeId}</span>
                <span className="text-xs text-slate-500">{observer.role}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={observer.status} />
        </div>

        <div className="space-y-2 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{observer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{observer.phone}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          {observer.assignedCenter && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Center</div>
              <div className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                {observer.assignedCenter}
              </div>
            </div>
          )}
          
          {observer.assignedExams && observer.assignedExams.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Exams</div>
              <div className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                <Building2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {observer.assignedExams.map(ex => (
                    <span key={ex} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs">{ex}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-center flex-1 border-r border-slate-200">
            <div className="text-sm font-bold text-slate-900">{observer.totalDuties}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">Duties</div>
          </div>
          <div className="text-center flex-1 border-r border-slate-200">
            <div className="text-sm font-bold text-emerald-600">{observer.performanceScore}/10</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">Score</div>
          </div>
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
              {observer.rating} <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
