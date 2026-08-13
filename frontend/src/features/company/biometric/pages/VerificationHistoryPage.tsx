import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import { DUMMY_BIOMETRIC_HISTORY } from '../utils/placeholder';

export function VerificationHistoryPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Audit Logs: Biometrics" 
        description="Comprehensive history of all biometric captures, automated results, and manual overrides." 
      />
      <HistoryTable history={DUMMY_BIOMETRIC_HISTORY} />
    </div>
  );
}
