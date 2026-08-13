import React from 'react';
import type { SupportTicket } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TicketCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
       <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
             <div className="flex flex-col">
                <Link to={`/company/support/${ticket.id}`} className="font-bold text-slate-900 hover:text-indigo-600 truncate">{ticket.subject}</Link>
                <span className="text-xs font-mono text-slate-500 mt-1">{ticket.ticketNumber}</span>
             </div>
             <div className="flex gap-2">
                <StatusBadge status={ticket.status} />
             </div>
          </div>
          
          <div className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
             {ticket.description}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100 pt-3">
             <div className="flex items-center gap-3">
                <PriorityBadge priority={ticket.priority} />
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ticket.category}</span>
             </div>
             <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1" title="Last Updated"><Clock className="w-3.5 h-3.5" /> 2h</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 3</span>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}
