import React from 'react';
import { User } from 'lucide-react';
import { DUMMY_CANDIDATE } from '../utils/placeholder';

export function CandidateInfoCard() {
  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {DUMMY_CANDIDATE.photoUrl ? (
            <img src={DUMMY_CANDIDATE.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-slate-400" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{DUMMY_CANDIDATE.name}</h3>
          <p className="text-sm text-slate-500 font-mono mt-0.5">{DUMMY_CANDIDATE.rollNumber}</p>
        </div>
      </div>
    </div>
  );
}
