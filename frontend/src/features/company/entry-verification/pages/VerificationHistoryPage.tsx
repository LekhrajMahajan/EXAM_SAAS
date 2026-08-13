import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { VerificationHistoryTable } from '../components/VerificationHistoryTable';
import { DUMMY_VERIFICATION_HISTORY } from '../utils/placeholder';

export function VerificationHistoryPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Audit Logs: Entry Verification" 
        description="Comprehensive history of all candidate check-in and verification actions." 
      />
      <VerificationHistoryTable history={DUMMY_VERIFICATION_HISTORY} />
    </div>
  );
}
