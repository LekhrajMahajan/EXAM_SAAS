import React from 'react';
import type { TimelineEvent } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CircleDot } from 'lucide-react';

interface TimelineCardProps {
  events: TimelineEvent[];
}

export function TimelineCard({ events }: TimelineCardProps) {
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      default: return 'text-indigo-600 bg-indigo-100';
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
         <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 py-4">
            {events.map((event, i) => (
              <div key={event.id} className="relative pl-6">
                 {/* Timeline Dot */}
                 <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${getSeverityColor(event.severity)}`}>
                    <CircleDot className="w-3 h-3" />
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">{event.title}</h4>
                    <span className="text-xs font-mono text-slate-500 whitespace-nowrap">{event.timestamp}</span>
                 </div>
                 
                 <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                 
                 <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{event.module}</span>
                    <span className="flex items-center gap-1">User: <span className="font-semibold">{event.user}</span></span>
                 </div>
              </div>
            ))}
         </div>
      </CardContent>
    </Card>
  );
}
