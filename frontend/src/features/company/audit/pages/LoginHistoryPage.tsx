import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_AUDIT_LOGS } from '../utils/placeholder';
import { AuditTable } from '../components/AuditTable';
import { FilterPanel } from '../components/FilterPanel';

export function LoginHistoryPage() {
  const loginLogs = DUMMY_AUDIT_LOGS.filter(log => log.module === 'Authentication');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Login History" 
        description="Track all successful and failed authentication attempts across the platform." 
      />
      <FilterPanel />
      <AuditTable logs={loginLogs} />
    </div>
  );
}
