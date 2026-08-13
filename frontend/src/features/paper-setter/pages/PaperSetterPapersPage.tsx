import React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AssignedPapersList } from '../components/AssignedPapersList';

export function PaperSetterPapersPage() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Your Paper Sets" 
        description="View and manage all your assigned question papers." 
      />
      <div className="mt-6">
        <AssignedPapersList />
      </div>
    </DashboardLayout>
  );
}
