import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CandidateGrid } from '../components/CandidateGrid';
import { DUMMY_LIVE_CANDIDATES } from '../utils/placeholder';
import { Input } from '@/shared/components/ui/input';
import { Search, Filter, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function CandidateMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Candidate Monitoring" 
          description="Live grid view of all active candidates taking exams." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-white">
             <Filter className="w-4 h-4 mr-2" />
             Filters
           </Button>
           <Button variant="outline" size="icon" className="bg-white">
             <RefreshCw className="w-4 h-4 text-slate-600" />
           </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by candidate name or app number..." 
            className="pl-9 bg-slate-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md">
          <Button variant="ghost" size="sm" className="h-8 px-3 bg-white shadow-sm">
             <LayoutGrid className="w-4 h-4 mr-2 text-indigo-600" />
             Grid
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-slate-500 hover:text-slate-700">
             <List className="w-4 h-4 mr-2" />
             List
          </Button>
        </div>
      </div>

      <CandidateGrid candidates={DUMMY_LIVE_CANDIDATES} />
    </div>
  );
}
