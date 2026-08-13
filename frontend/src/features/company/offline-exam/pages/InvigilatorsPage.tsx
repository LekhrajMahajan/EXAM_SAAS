import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_INVIGILATORS } from '../utils/placeholder';
import { InvigilatorCard } from '../components/InvigilatorCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function InvigilatorsPage() {
  const [status, setStatus] = useState('');

  const filtered = status
    ? DUMMY_INVIGILATORS.filter(i => i.dutyStatus === status)
    : DUMMY_INVIGILATORS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Invigilator Management" description="Assign invigilators to rooms, track duty status, and manage replacements." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Assign Invigilator
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'Assigned', 'Present', 'Absent', 'Replaced'].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inv => <InvigilatorCard key={inv.id} invigilator={inv} />)}
      </div>
    </div>
  );
}
