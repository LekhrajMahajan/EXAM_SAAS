import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_VERSIONS, DUMMY_FILES } from '../utils/placeholder';
import { VersionTable } from '../components/VersionTable';
import { PreviewPanel } from '../components/PreviewPanel';

export function VersionHistoryPage() {
  const file = DUMMY_FILES[4]; // merit_certificate_template_v2 has versions

  return (
    <div className="space-y-6">
      <PageHeader
        title="Version History"
        description="Review all uploaded versions of a document and restore previous ones."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PreviewPanel file={file} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900">All Versions</h3>
          <VersionTable versions={DUMMY_VERSIONS} />
        </div>
      </div>
    </div>
  );
}
