import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ShiftWizard } from '../components/ShiftWizard';

export function CreateShiftPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Create Shift" 
        description="Follow the steps to configure and schedule a new examination shift." 
      />
      <ShiftWizard />
    </div>
  );
}
