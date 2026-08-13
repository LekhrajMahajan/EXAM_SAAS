import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SUPPORT_STATS, DUMMY_TICKETS } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { SupportTable } from '../components/SupportTable';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SupportDashboardPage() {
  const recentTickets = DUMMY_TICKETS.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader 
          title="Help Desk Dashboard" 
          description="Overview of support tickets, SLAs, and active issues." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
           <Link to="/company/support/create"><Plus className="w-4 h-4 mr-2" /> New Ticket</Link>
        </Button>
      </div>

      <StatisticsGrid stats={DUMMY_SUPPORT_STATS} />
      
      <div className="space-y-4">
         <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-slate-900">Recent Tickets</h3>
            <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
               <Link to="/company/support/tickets">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
         </div>
         <SupportTable tickets={recentTickets} />
      </div>
    </div>
  );
}
