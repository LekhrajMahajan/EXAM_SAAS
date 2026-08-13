import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { UploadCard } from '../components/UploadCard';

export function UploadCenterPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Upload Center"
        description="Upload single or multiple files into the system. Files are validated before storage."
      />
      <UploadCard />
    </div>
  );
}
