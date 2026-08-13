import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_AUDIT_LOGS } from '../utils/placeholder';
import { AuditTable } from '../components/AuditTable';
import { FilterPanel } from '../components/FilterPanel';

export function SystemEventsPage() {
  const systemLogs = DUMMY_AUDIT_LOGS.filter(log => log.module === 'System' || log.module === 'Security');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Events" 
        description="Audit log of administrative configuration changes and platform-level updates." 
      />
      <FilterPanel />
      <AuditTable logs={systemLogs} />
    </div>
  );
}
