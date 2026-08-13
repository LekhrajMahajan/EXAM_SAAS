import React from 'react';
import type { LiveCandidate } from '../types';
import { CandidateCard } from './CandidateCard';

interface CandidateGridProps {
  candidates: LiveCandidate[];
}

export function CandidateGrid({ candidates }: CandidateGridProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No candidates match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
