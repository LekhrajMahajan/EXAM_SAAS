import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { ExportDialog } from './ExportDialog';

export function FilterPanel() {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 w-full" placeholder="Search by user, action, or description..." />
         </div>
         <div className="flex flex-wrap md:flex-nowrap gap-2">
            <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
               <option value="">All Modules</option>
               <option value="auth">Authentication</option>
               <option value="exam">Exam</option>
               <option value="api">API</option>
            </select>
            <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
               <option value="">All Severities</option>
               <option value="critical">Critical</option>
               <option value="high">High</option>
               <option value="medium">Medium</option>
               <option value="low">Low</option>
            </select>
            <Button variant="outline">
               <Filter className="w-4 h-4 mr-2" />
               More Filters
            </Button>
            <ExportDialog 
               trigger={
                  <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                     <Download className="w-4 h-4 mr-2" />
                     Export
                  </Button>
               } 
            />
         </div>
      </div>
    </div>
  );
}
