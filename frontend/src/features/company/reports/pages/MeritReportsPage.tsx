import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { FilterPanel } from '../components/FilterPanel';
import { ReportTable } from '../components/ReportTable';
import { DUMMY_REPORTS } from '../utils/placeholder';

export function MeritReportsPage() {
  const reports = DUMMY_REPORTS.filter(r => r.category === 'Merit');
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Merit & Ranking Reports" 
        description="Analysis of top performers and category-wise cutoffs." 
      />
      <FilterPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <AnalyticsCard title="Category Cutoffs Over Time">
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
