import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TEMPLATES } from '../utils/placeholder';
import { TemplateCard } from '../components/TemplateCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function NotificationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader 
          title="Notification Templates" 
          description="Design and manage reusable templates for emails, SMS, and push notifications." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <Plus className="w-4 h-4 mr-2" /> Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {DUMMY_TEMPLATES.map(tpl => (
           <TemplateCard key={tpl.id} template={tpl} />
         ))}
      </div>
    </div>
  );
}
