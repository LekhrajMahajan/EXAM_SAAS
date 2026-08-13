import React from 'react';
import type { TicketTimelineEvent } from '../types';
import { CircleDot } from 'lucide-react';

interface TicketTimelineProps {
  events: TicketTimelineEvent[];
}

export function TicketTimeline({ events }: TicketTimelineProps) {
  return (
    <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-4">
      {events.map((event) => (
        <div key={event.id} className="relative pl-6">
           <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white bg-slate-100 text-slate-500`}>
              <CircleDot className="w-3 h-3" />
           </div>
           
           <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-slate-400">{event.timestamp}</span>
              <p className="text-sm text-slate-700">
                 <span className="font-semibold text-slate-900 mr-1">{event.user}</span>
                 {event.description}
              </p>
           </div>
        </div>
      ))}
    </div>
  );
}
