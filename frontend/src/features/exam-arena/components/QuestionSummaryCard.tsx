import React from 'react';
import { DUMMY_EXAM } from '../utils/placeholder';

export function QuestionSummaryCard() {
  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <h4 className="font-semibold text-slate-800 mb-3 text-sm">Exam Summary</h4>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-50 border border-slate-100 p-2 rounded">
          <p className="text-slate-500 text-xs">Total Questions</p>
          <p className="font-bold text-slate-900">{DUMMY_EXAM.totalQuestions}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-2 rounded">
          <p className="text-emerald-700 text-xs">Answered</p>
          <p className="font-bold text-emerald-900">1</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-2 rounded">
          <p className="text-red-700 text-xs">Unanswered</p>
          <p className="font-bold text-red-900">1</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-2 rounded">
          <p className="text-amber-700 text-xs">Marked for Review</p>
          <p className="font-bold text-amber-900">1</p>
        </div>
      </div>
    </div>
  );
}
