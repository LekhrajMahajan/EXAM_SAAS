import React from 'react';
import type { ShiftInfo } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Clock, Sun, Sunset, Moon } from 'lucide-react';
import { Switch } from '@/shared/components/ui/switch';

export function ShiftCard({ shift }: { shift: ShiftInfo }) {
  const getIcon = () => {
    switch (shift.type) {
      case 'Morning': return <Sun className="w-6 h-6 text-amber-500" />;
      case 'Afternoon': return <Sunset className="w-6 h-6 text-orange-500" />;
      case 'Evening': return <Moon className="w-6 h-6 text-indigo-500" />;
      default: return <Clock className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <Card className={`border shadow-sm transition-all ${shift.isActive ? 'border-indigo-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-75'}`}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${shift.isActive ? 'bg-indigo-50' : 'bg-slate-200'}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{shift.name}</h3>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-0.5">{shift.type}</div>
            </div>
          </div>
          <Switch checked={shift.isActive} />
        </div>

        <div className="flex items-center gap-2 mb-4 bg-slate-100/50 p-3 rounded-lg border border-slate-100">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-lg font-bold text-slate-700">{shift.startTime} <span className="text-slate-400 font-normal mx-1">—</span> {shift.endTime}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-slate-500 mb-1">Before Shift Buffer</div>
            <div className="font-bold text-slate-900 bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block border border-emerald-100">
              {shift.bufferBeforeMinutes} mins
            </div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">After Shift Buffer</div>
            <div className="font-bold text-slate-900 bg-sky-50 text-sky-700 px-2 py-1 rounded inline-block border border-sky-100">
              {shift.bufferAfterMinutes} mins
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
