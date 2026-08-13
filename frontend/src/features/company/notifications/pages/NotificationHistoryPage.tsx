import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { HistoryTable } from '../components/HistoryTable';
import { Input } from '@/shared/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function NotificationHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Delivery History" 
        description="Comprehensive audit trail of all outgoing communications and their delivery status." 
      />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search by recipient, title, or ID..." />
         </div>
         <div className="flex gap-2">
            <select className="flex h-10 w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
               <option value="">All Statuses</option>
               <option value="Delivered">Delivered</option>
               <option value="Failed">Failed</option>
            </select>
            <Button variant="outline" className="bg-white">
               <Filter className="w-4 h-4 mr-2" />
               More Filters
            </Button>
         </div>
      </div>

      <HistoryTable history={DUMMY_NOTIFICATIONS.filter(n => n.status === 'Delivered' || n.status === 'Failed')} />
    </div>
  );
}
