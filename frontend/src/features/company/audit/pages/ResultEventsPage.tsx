import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_AUDIT_LOGS } from '../utils/placeholder';
import { AuditTable } from '../components/AuditTable';
import { FilterPanel } from '../components/FilterPanel';

export function ResultEventsPage() {
  const resultLogs = DUMMY_AUDIT_LOGS.filter(log => log.module === 'Result');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Result Events" 
        description="Audit log of result generation, approval, publication, and merit list processing." 
      />
      <FilterPanel />
      <AuditTable logs={resultLogs} />
    </div>
  );
}
