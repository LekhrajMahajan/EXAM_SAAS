import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { MeritTable } from '../components/MeritTable';
import { DUMMY_MERIT_STATS, DUMMY_MERIT_RECORDS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function MeritDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Merit List Management" 
          description="Generate, view, and publish ranked merit lists based on candidate performance." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-white" asChild>
             <Link to="/company/merit/publish">Publish Lists</Link>
           </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
             <Link to="/company/merit/generate">
               <PlusCircle className="w-4 h-4 mr-2" />
               Generate Merit
             </Link>
           </Button>
        </div>
      </div>

      <StatisticsGrid stats={DUMMY_MERIT_STATS} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Recently Generated Rankings</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by candidate name or app ID..." 
                className="pl-9 bg-white"
              />
            </div>
            <Button variant="link" asChild className="text-indigo-600 p-0 flex-shrink-0">
              <Link to="/company/merit/list">View All</Link>
            </Button>
          </div>
        </div>
        
        <MeritTable records={DUMMY_MERIT_RECORDS} />
      </div>
    </div>
  );
}
