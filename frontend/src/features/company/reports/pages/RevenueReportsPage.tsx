import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { FilterPanel } from '../components/FilterPanel';
import { ReportTable } from '../components/ReportTable';
import { DUMMY_REPORTS } from '../utils/placeholder';

export function RevenueReportsPage() {
  const reports = DUMMY_REPORTS.filter(r => r.category === 'Revenue');
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Revenue & Finance Reports" 
        description="Financial metrics related to examination fees and collections." 
      />
      <FilterPanel />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <AnalyticsCard title="Revenue by Exam">
            <ChartPlaceholder type="pie" />
         </AnalyticsCard>
         <AnalyticsCard title="Collection Over Time" className="md:col-span-2">
            <ChartPlaceholder type="line" />
         </AnalyticsCard>
      </div>
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900">Standard Reports</h3>
        <ReportTable records={reports} />
      </div>
    </div>
  );
}
