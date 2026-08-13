import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CenterStatusCard } from '../components/CenterStatusCard';
import { DUMMY_LIVE_CENTERS } from '../utils/placeholder';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function CenterMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Test Centers Health" 
        description="Monitor network connectivity and device health across all active test centers." 
      />

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search center by name or ID..." 
            className="pl-9 bg-slate-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_LIVE_CENTERS.map((center) => (
          <CenterStatusCard key={center.id} center={center} />
        ))}
      </div>
    </div>
  );
}
