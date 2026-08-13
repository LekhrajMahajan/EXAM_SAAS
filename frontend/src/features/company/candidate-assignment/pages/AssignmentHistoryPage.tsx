import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import { DUMMY_HISTORY } from '../utils/placeholder';

export function AssignmentHistoryPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Assignment History" 
        description="Audit log of all past candidate assignment activities." 
      />
      <HistoryTable history={DUMMY_HISTORY} />
    </div>
  );
}
