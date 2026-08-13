import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import { DUMMY_MERIT_HISTORY } from '../utils/placeholder';

export function MeritHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Merit Generation & Publish Logs" 
        description="View the audit history of all rankings generated and published in the system." 
      />
      <HistoryTable history={DUMMY_MERIT_HISTORY} />
    </div>
  );
}
