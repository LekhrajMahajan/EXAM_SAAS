import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_PERFORMANCE } from '../utils/placeholder';
import { PerformanceCard } from '../components/PerformanceCard';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function PerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Performance Analytics" description="Review observer and invigilator performance metrics, attendance rates, and incident resolution." />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search staff members..." />
        </div>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Roles</option>
          <option>Observer</option>
          <option>Invigilator</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>Sort by Score (High to Low)</option>
          <option>Sort by Score (Low to High)</option>
          <option>Sort by Attendance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_PERFORMANCE.map(perf => <PerformanceCard key={perf.id} perf={perf} />)}
      </div>
    </div>
  );
}
