import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CertificateTemplateCard } from '../components/CertificateTemplateCard';
import { DUMMY_TEMPLATES } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function CertificateTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Certificate Templates" 
          description="Manage the design formats used to generate certificates." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {DUMMY_TEMPLATES.map((template) => (
            <CertificateTemplateCard 
               key={template.id} 
               template={template} 
            />
         ))}
      </div>
    </div>
  );
}
