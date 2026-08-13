import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_INTEGRATIONS } from '../utils/placeholder';
import { IntegrationCard } from '../components/IntegrationCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function IntegrationsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Connected Services" 
          description="Manage third-party integrations like Payment Gateways, SMS, and Cloud Storage." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <Plus className="w-4 h-4 mr-2" /> Add Integration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {DUMMY_INTEGRATIONS.map(integration => (
           <IntegrationCard key={integration.id} integration={integration} />
         ))}
      </div>
    </div>
  );
}
