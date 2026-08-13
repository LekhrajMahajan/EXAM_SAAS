import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ImportWizard } from '../components/ImportWizard';

export function ImportQuestionsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Import Questions Wizard" 
        description="Follow the steps to successfully import questions into the bank." 
      />
      <ImportWizard />
    </div>
  );
}
