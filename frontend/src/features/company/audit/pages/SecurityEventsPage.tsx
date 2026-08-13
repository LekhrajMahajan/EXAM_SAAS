import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SECURITY_EVENTS } from '../utils/placeholder';
import { SecurityEventCard } from '../components/SecurityEventCard';
import { FilterPanel } from '../components/FilterPanel';

export function SecurityEventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Security Events" 
        description="Review critical incidents, unauthorized access attempts, and permission changes." 
      />
      <FilterPanel />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {DUMMY_SECURITY_EVENTS.map(event => (
           <SecurityEventCard key={event.id} event={event} />
         ))}
      </div>
    </div>
  );
}
