import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_AUDIT_LOGS } from '../utils/placeholder';
import { AuditTable } from '../components/AuditTable';
import { FilterPanel } from '../components/FilterPanel';

export function ExamEventsPage() {
  const examLogs = DUMMY_AUDIT_LOGS.filter(log => log.module === 'Exam');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exam Events" 
        description="Track exam lifecycle events including creation, publishing, modifications, and cancellations." 
      />
      <FilterPanel />
      <AuditTable logs={examLogs} />
    </div>
  );
}
