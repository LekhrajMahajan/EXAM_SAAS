import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_RESULTS } from '../utils/placeholder';
import { ResultCard } from '../components/ResultCard';

export function CandidateResultsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Exam Results" 
        description="View your performance and marks across all attempts." 
      />

      <div className="grid gap-6">
        {DUMMY_RESULTS.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
        {DUMMY_RESULTS.length === 0 && (
           <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
              <p className="text-slate-500">No results have been published yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
