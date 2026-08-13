import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AssignmentWizard } from '../components/AssignmentWizard';

export function CreateAssignmentPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Create Assignment" 
        description="Allocate rooms and seats to candidates." 
      />
      <AssignmentWizard />
    </div>
  );
}
