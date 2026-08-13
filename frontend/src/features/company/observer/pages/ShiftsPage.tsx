import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SHIFTS } from '../utils/placeholder';
import { ShiftCard } from '../components/ShiftCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function ShiftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Shift Management" description="Configure exam shifts and define staff buffer timings before and after exams." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Shift
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_SHIFTS.map(shift => <ShiftCard key={shift.id} shift={shift} />)}
      </div>
    </div>
  );
}
