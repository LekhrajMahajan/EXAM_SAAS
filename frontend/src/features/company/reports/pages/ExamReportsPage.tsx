import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { FilterPanel } from '../components/FilterPanel';
import { ReportTable } from '../components/ReportTable';
import { DUMMY_REPORTS } from '../utils/placeholder';

export function ExamReportsPage() {
  const examReports = DUMMY_REPORTS.filter(r => r.category === 'Exam');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exam Performance Reports" 
        description="Analytics and insights regarding overall examination health and candidate scores." 
      />
      
      <FilterPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <AnalyticsCard title="Average Scores by Subject">
            <ChartPlaceholder type="bar" />
         </AnalyticsCard>
         <AnalyticsCard title="Pass/Fail Ratio Trend">
            <ChartPlaceholder type="line" />
         </AnalyticsCard>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900">Standard Reports</h3>
        <ReportTable records={examReports} />
      </div>
    </div>
  );
}
