import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TICKETS } from '../utils/placeholder';
import { TicketCard } from '../components/TicketCard';

export function TicketAssignmentPage() {
  const unassignedTickets = DUMMY_TICKETS.filter(t => !t.assignedTo);
  const assignedTickets = DUMMY_TICKETS.filter(t => t.assignedTo);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ticket Assignment Queue" 
        description="Manage the dispatch and assignment of support requests to agents and teams." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Unassigned Queue <span className="text-slate-400 ml-2 text-sm font-normal">({unassignedTickets.length})</span></h3>
            <div className="grid grid-cols-1 gap-4">
               {unassignedTickets.length > 0 ? (
                 unassignedTickets.map(t => <TicketCard key={t.id} ticket={t} />)
               ) : (
                 <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
                    All tickets are currently assigned.
                 </div>
               )}
            </div>
         </div>
         
         <div className="space-y-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Recently Assigned <span className="text-slate-400 ml-2 text-sm font-normal">({assignedTickets.length})</span></h3>
            <div className="grid grid-cols-1 gap-4">
               {assignedTickets.slice(0, 3).map(t => <TicketCard key={t.id} ticket={t} />)}
            </div>
         </div>
      </div>
    </div>
  );
}
