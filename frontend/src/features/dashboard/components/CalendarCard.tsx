import React from 'react';
import { WidgetCard } from './WidgetCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function CalendarCard() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <WidgetCard title="Calendar" action={<CalendarIcon className="w-4 h-4 text-slate-400" />}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 px-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm font-bold text-slate-800">October 2026</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ChevronRight className="w-4 h-4" /></Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {days.map(d => <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array(4).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {dates.map(d => {
            const isToday = d === 20;
            const hasEvent = [15, 22, 28].includes(d);
            return (
              <div key={d} className="flex justify-center items-center aspect-square p-1">
                <button className={`w-full h-full rounded-full flex flex-col items-center justify-center text-xs transition-colors relative
                  ${isToday ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-100 text-slate-700'}
                `}>
                  {d}
                  {hasEvent && !isToday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
