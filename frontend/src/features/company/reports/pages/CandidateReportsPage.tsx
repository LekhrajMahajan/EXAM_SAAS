import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { FilterPanel } from '../components/FilterPanel';
import { ReportTable } from '../components/ReportTable';
import { DUMMY_REPORTS } from '../utils/placeholder';

export function CandidateReportsPage() {
  const reports = DUMMY_REPORTS.filter(r => r.category === 'Candidate');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Candidate Demographic Reports" 
        description="Analyze candidate backgrounds, geographic distribution, and category statistics." 
      />
      
      <FilterPanel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <AnalyticsCard title="Gender Distribution">
            <ChartPlaceholder type="pie" />
         </AnalyticsCard>
         <AnalyticsCard title="Category Distribution">
            <ChartPlaceholder type="pie" />
         </AnalyticsCard>
         <AnalyticsCard title="Geographic Heatmap">
            <ChartPlaceholder type="map" />
         </AnalyticsCard>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900">Standard Reports</h3>
        <ReportTable records={reports} />
      </div>
    </div>
  );
}
