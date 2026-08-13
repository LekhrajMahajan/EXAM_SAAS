import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Filter, X } from 'lucide-react';
import { DUMMY_EXAMS, DUMMY_CENTERS } from '../utils/placeholder';

export function FilterPanel() {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) {
     return (
       <Button variant="outline" className="bg-white border-slate-200" onClick={() => setIsOpen(true)}>
         <Filter className="w-4 h-4 mr-2" />
         Show Filters
       </Button>
     );
  }

  return (
    <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-slate-900 flex items-center gap-2">
             <Filter className="w-4 h-4 text-indigo-500" />
             Global Filters
           </h3>
           <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 text-slate-500">
             <X className="w-4 h-4 mr-2" /> Close
           </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           
           <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-700 uppercase">Date Range</label>
             <input type="date" className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm" />
           </div>

           <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-700 uppercase">Exam</label>
             <select className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm">
                <option value="">All Exams</option>
                {DUMMY_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
             </select>
           </div>

           <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-700 uppercase">Center</label>
             <select className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm">
                <option value="">All Centers</option>
                {DUMMY_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>

           <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-700 uppercase">Status</label>
             <select className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm">
                <option value="">All Statuses</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
             </select>
           </div>

        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-slate-200/50 pt-4">
           <Button variant="outline" size="sm" className="bg-white">Reset</Button>
           <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
