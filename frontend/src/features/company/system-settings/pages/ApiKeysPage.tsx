import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_API_KEYS } from '../utils/placeholder';
import { ApiKeyTable } from '../components/ApiKeyTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, ShieldAlert } from 'lucide-react';

export function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader 
          title="API Keys" 
          description="Manage access keys for developer integration and external applications." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <Plus className="w-4 h-4 mr-2" /> Generate New Key
        </Button>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
         <ShieldAlert className="w-5 h-5 flex-shrink-0" />
         <div>
            <h4 className="font-bold text-sm">Security Notice</h4>
            <p className="text-xs mt-1">API keys grant full access to your organization's data. Do not share them publicly or commit them to version control. Revoke keys immediately if you suspect they have been compromised.</p>
         </div>
      </div>

      <ApiKeyTable keys={DUMMY_API_KEYS} />
    </div>
  );
}
