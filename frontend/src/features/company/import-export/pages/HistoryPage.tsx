import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_JOBS } from '../utils/placeholder';
import { HistoryTable } from '../components/HistoryTable';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Import' | 'Export'>('All');

  const filteredJobs = DUMMY_JOBS.filter(j => {
    if (activeTab === 'All') return true;
    return j.type === activeTab;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Processing History"
        description="A complete record of all completed import and export operations."
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 w-full" placeholder="Search by file name or module..." />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {(['All', 'Import', 'Export'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-bold transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <HistoryTable jobs={filteredJobs} />
    </div>
  );
}
