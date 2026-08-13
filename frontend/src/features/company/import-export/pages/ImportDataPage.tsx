import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ImportWizard } from '../components/ImportWizard';

export function ImportDataPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Data"
        description="Upload and map external data files into the system using the guided wizard below."
      />
      <ImportWizard />
    </div>
  );
}
