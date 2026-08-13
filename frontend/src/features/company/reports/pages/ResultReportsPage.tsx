import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { FilterPanel } from '../components/FilterPanel';

export function ResultReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Result Reports" 
        description="In-depth analysis of scoring, percentiles, and anomalies." 
      />
      <FilterPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <AnalyticsCard title="Score Distribution (Bell Curve)">
            <ChartPlaceholder type="line" />
         </AnalyticsCard>
         <AnalyticsCard title="Percentile Brackets">
            <ChartPlaceholder type="bar" />
         </AnalyticsCard>
      </div>
    </div>
  );
}
