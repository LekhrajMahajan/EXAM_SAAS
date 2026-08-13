import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TEMPLATES } from '../utils/placeholder';
import { TemplateCard } from '../components/TemplateCard';

export function ImportTemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Templates"
        description="Download pre-configured templates to ensure your data is correctly formatted before importing."
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <span className="font-bold">Tip:</span> Always use the official templates to avoid import errors. Required fields are marked in the template headers.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_TEMPLATES.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
