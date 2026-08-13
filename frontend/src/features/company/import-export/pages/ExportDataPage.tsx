import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ExportWizard } from '../components/ExportWizard';

export function ExportDataPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Data"
        description="Configure your export job by selecting a module, fields, and output format."
      />
      <ExportWizard />
    </div>
  );
}
