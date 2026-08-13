import React from 'react';
import type { TicketStatus } from '../types';
import { CircleDot, Circle, CheckCircle2, XCircle } from 'lucide-react';

export function StatusBadge({ status }: { status: TicketStatus }) {
  switch (status) {
    case 'Open': 
      return <span className="flex items-center gap-1 text-red-600 font-medium text-xs"><Circle className="w-3.5 h-3.5" /> Open</span>;
    case 'In Progress': 
      return <span className="flex items-center gap-1 text-amber-600 font-medium text-xs"><CircleDot className="w-3.5 h-3.5" /> In Progress</span>;
    case 'Resolved': 
      return <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>;
    case 'Closed': 
      return <span className="flex items-center gap-1 text-slate-500 font-medium text-xs"><XCircle className="w-3.5 h-3.5" /> Closed</span>;
  }
  return null;
}
