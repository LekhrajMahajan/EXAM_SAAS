import React from 'react';
import type { SupportTicket } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SupportTableProps {
  tickets: SupportTicket[];
}

export function SupportTable({ tickets }: SupportTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Ticket / Category</th>
              <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
              <th scope="col" className="px-4 py-3 font-semibold">Raised By</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Priority</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Assigned To</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="font-bold text-slate-900">{ticket.ticketNumber}</div>
                   <div className="text-[10px] text-slate-500 uppercase">{ticket.category}</div>
                </td>
                <td className="px-4 py-3 max-w-[250px]">
                   <div className="font-medium text-slate-900 truncate" title={ticket.subject}>{ticket.subject}</div>
                   <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" /> Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}
                   </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="font-medium text-slate-900">{ticket.raisedBy.name}</div>
                   <div className="text-[10px] text-slate-500 uppercase">{ticket.raisedBy.role}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <div className="flex justify-center"><StatusBadge status={ticket.status} /></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   {ticket.assignedTo ? (
                     <>
                        <div className="font-medium text-slate-900">{ticket.assignedTo.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{ticket.assignedTo.team}</div>
                     </>
                   ) : (
                     <span className="text-xs text-slate-400 italic">Unassigned</span>
                   )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600" asChild>
                      <Link to={`/company/support/${ticket.id}`}><Eye className="w-4 h-4" /></Link>
                   </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
