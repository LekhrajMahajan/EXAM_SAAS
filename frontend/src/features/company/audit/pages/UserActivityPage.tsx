import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_AUDIT_LOGS } from '../utils/placeholder';
import { AuditTable } from '../components/AuditTable';
import { FilterPanel } from '../components/FilterPanel';

export function UserActivityPage() {
  const userLogs = DUMMY_AUDIT_LOGS.filter(log => log.module === 'User Management' || log.userName !== 'System Admin');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Activity Trail" 
        description="Detailed chronological log of actions performed by specific users or roles." 
      />
      <FilterPanel />
      <AuditTable logs={userLogs} />
    </div>
  );
}
