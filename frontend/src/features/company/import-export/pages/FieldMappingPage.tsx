import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_MAPPINGS } from '../utils/placeholder';
import { MappingTable } from '../components/MappingTable';
import { Button } from '@/shared/components/ui/button';
import { Save } from 'lucide-react';

export function FieldMappingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="Field Mapping"
          description="Configure how source file columns map to system destination fields for each module."
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Save className="w-4 h-4 mr-2" /> Save Mapping
        </Button>
      </div>

      <MappingTable mappings={DUMMY_MAPPINGS} />
    </div>
  );
}
