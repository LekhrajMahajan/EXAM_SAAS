import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardGrid } from '../components/DashboardGrid';
import { SummaryCard } from '../components/SummaryCard';
import { CheckSquare } from 'lucide-react';

export function PaperReviewerDashboard() {
  return (
    <DashboardLayout>
      <PageHeader title="Paper Reviewer Dashboard" description="Review pending question papers and provide feedback." />
      
      <DashboardGrid columns={2}>
        <SummaryCard 
          title="Pending Reviews" 
          icon={CheckSquare}
          items={[
            { label: 'Chemistry Set C', value: 'Due Today', color: 'text-rose-600' },
            { label: 'Biology Set A', value: 'Due in 2 days', color: 'text-amber-600' },
          ]} 
        />
        <SummaryCard 
          title="Recent Approvals" 
          icon={CheckSquare}
          items={[
            { label: 'Physics Set B', value: 'Approved on Oct 18' },
          ]} 
        />
      </DashboardGrid>
    </DashboardLayout>
  );
}
