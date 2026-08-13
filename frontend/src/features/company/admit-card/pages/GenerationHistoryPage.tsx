import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import { DUMMY_ADMIT_HISTORY } from '../utils/placeholder';

export function GenerationHistoryPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Generation History" 
        description="Audit log of all past admit card generation events." 
      />
      <HistoryTable history={DUMMY_ADMIT_HISTORY} />
    </div>
  );
}
