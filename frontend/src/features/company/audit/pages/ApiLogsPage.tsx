import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_API_LOGS } from '../utils/placeholder';
import { ApiLogTable } from '../components/ApiLogTable';
import { FilterPanel } from '../components/FilterPanel';

export function ApiLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="API Activity Logs" 
        description="Developer-level logs tracking REST API endpoints, payload sizes, and execution times." 
      />
      <FilterPanel />
      <ApiLogTable logs={DUMMY_API_LOGS} />
    </div>
  );
}
