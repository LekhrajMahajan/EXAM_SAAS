import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { FilterPanel } from '../components/FilterPanel';
import { ReportTable } from '../components/ReportTable';
import { DUMMY_REPORTS } from '../utils/placeholder';

export function CenterReportsPage() {
  const reports = DUMMY_REPORTS.filter(r => r.category === 'Center');
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Center Performance Reports" 
        description="Monitor examination centers, capacity utilization, and incident rates." 
      />
      <FilterPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <AnalyticsCard title="Capacity Utilization">
            <ChartPlaceholder type="bar" />
         </AnalyticsCard>
         <AnalyticsCard title="Incident Frequency by Center">
            <ChartPlaceholder type="activity" />
         </AnalyticsCard>
      </div>
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900">Standard Reports</h3>
        <ReportTable records={reports} />
      </div>
    </div>
  );
}
