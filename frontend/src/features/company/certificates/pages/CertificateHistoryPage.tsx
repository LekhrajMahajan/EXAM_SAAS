import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import { DUMMY_CERT_HISTORY } from '../utils/placeholder';

export function CertificateHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Certificate Logs" 
        description="Audit history of generations, downloads, and external verifications." 
      />
      <HistoryTable history={DUMMY_CERT_HISTORY} />
    </div>
  );
}
