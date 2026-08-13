import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import { DUMMY_RESULT_HISTORY } from '../utils/placeholder';

export function ResultHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Generation & Publish History" 
        description="Audit log of all result generation and publication jobs." 
      />
      <HistoryTable history={DUMMY_RESULT_HISTORY} />
    </div>
  );
}
