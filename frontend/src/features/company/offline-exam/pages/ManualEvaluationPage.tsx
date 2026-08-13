import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_EVALUATIONS } from '../utils/placeholder';
import { EvaluationTable } from '../components/EvaluationTable';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';

export function ManualEvaluationPage() {
  const [status, setStatus] = useState('');

  const filtered = status
    ? DUMMY_EVALUATIONS.filter(e => e.status === status)
    : DUMMY_EVALUATIONS;

  const pending = DUMMY_EVALUATIONS.filter(e => e.status === 'Pending').length;
  const inProgress = DUMMY_EVALUATIONS.filter(e => e.status === 'In Progress').length;
  const completed = DUMMY_EVALUATIONS.filter(e => e.status === 'Completed' || e.status === 'Reviewed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Manual Evaluation" description="Track and manage manual answer sheet evaluations by evaluators." />
        <Button variant="outline" className="bg-white">
          <Download className="w-4 h-4 mr-2" /> Export Marks
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-800">{pending}</div>
          <div className="text-xs font-bold text-amber-600 uppercase mt-1">Pending Evaluation</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-sky-800">{inProgress}</div>
          <div className="text-xs font-bold text-sky-600 uppercase mt-1">In Progress</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-800">{completed}</div>
          <div className="text-xs font-bold text-emerald-600 uppercase mt-1">Completed / Reviewed</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'Pending', 'In Progress', 'Completed', 'Reviewed'].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
      </div>

      <EvaluationTable sheets={filtered} />
    </div>
  );
}
