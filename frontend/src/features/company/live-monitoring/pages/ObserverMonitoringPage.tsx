import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ObserverCard } from '../components/ObserverCard';
import { DUMMY_LIVE_OBSERVERS } from '../utils/placeholder';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function ObserverMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Proctors & Observers" 
        description="Track the status and active assignments of your live invigilators." 
      />

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search observer by name..." 
            className="pl-9 bg-slate-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DUMMY_LIVE_OBSERVERS.map((observer) => (
          <ObserverCard key={observer.id} observer={observer} />
        ))}
      </div>
    </div>
  );
}
