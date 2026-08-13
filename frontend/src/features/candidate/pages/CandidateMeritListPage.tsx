import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_MERIT_LIST } from '../utils/placeholder';
import { MeritCard } from '../components/MeritCard';

export function CandidateMeritListPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Merit & Ranking" 
        description="Check your overall and category ranks." 
      />

      <div className="grid gap-6">
        {DUMMY_MERIT_LIST.map((merit) => (
          <MeritCard key={merit.id} merit={merit} />
        ))}
        {DUMMY_MERIT_LIST.length === 0 && (
           <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
              <p className="text-slate-500">Merit lists are not available at this time.</p>
           </div>
        )}
      </div>
    </div>
  );
}
