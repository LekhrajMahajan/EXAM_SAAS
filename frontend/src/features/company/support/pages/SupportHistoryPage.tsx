import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TICKETS } from '../utils/placeholder';
import { SupportTable } from '../components/SupportTable';

export function SupportHistoryPage() {
  const closedTickets = DUMMY_TICKETS.filter(t => t.status === 'Closed' || t.status === 'Resolved');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Support History" 
        description="Archive of all resolved and closed support requests." 
      />
      <SupportTable tickets={closedTickets} />
    </div>
  );
}
