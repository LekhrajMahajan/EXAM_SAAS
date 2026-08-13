import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TICKETS } from '../utils/placeholder';
import { SupportTable } from '../components/SupportTable';
import { Input } from '@/shared/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function TicketListPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="All Tickets" 
        description="Search, filter, and manage all support requests." 
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 w-full" placeholder="Search by ticket number, subject, or user..." />
         </div>
         <div className="flex flex-wrap md:flex-nowrap gap-2">
            <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
               <option value="">All Statuses</option>
               <option value="Open">Open</option>
               <option value="In Progress">In Progress</option>
               <option value="Resolved">Resolved</option>
            </select>
            <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
               <option value="">All Priorities</option>
               <option value="Urgent">Urgent</option>
               <option value="High">High</option>
               <option value="Medium">Medium</option>
               <option value="Low">Low</option>
            </select>
            <Button variant="outline" className="bg-white">
               <Filter className="w-4 h-4 mr-2" />
               More Filters
            </Button>
         </div>
      </div>

      <SupportTable tickets={DUMMY_TICKETS} />
    </div>
  );
}
