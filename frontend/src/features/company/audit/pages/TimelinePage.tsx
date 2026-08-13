import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TIMELINE } from '../utils/placeholder';
import { TimelineCard } from '../components/TimelineCard';
import { FilterPanel } from '../components/FilterPanel';

export function TimelinePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="System Timeline" 
        description="A unified, chronological feed of all significant system events." 
      />
      <FilterPanel />
      <TimelineCard events={DUMMY_TIMELINE} />
    </div>
  );
}
