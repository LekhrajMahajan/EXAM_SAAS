import React from 'react';
import type { ImportExportJob } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Loader2 } from 'lucide-react';

export function ProgressCard({ job }: { job: ImportExportJob }) {
  return (
    <Card className="border-indigo-200 shadow-sm bg-indigo-50/50">
       <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
             <div>
                <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                   {job.type}ing {job.module}...
                </h3>
                <p className="text-xs text-indigo-700/70 mt-1 font-mono">{job.fileName}</p>
             </div>
             <span className="text-sm font-bold text-indigo-700 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">{job.progress}%</span>
          </div>

          <div className="w-full bg-indigo-100 rounded-full h-2.5 mb-2 overflow-hidden">
             <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${job.progress}%` }}></div>
          </div>
          
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-800/60 mt-3">
             <span>{job.processedRecords.toLocaleString()} / {job.totalRecords.toLocaleString()} Records</span>
             {job.errorRecords > 0 && <span className="text-red-500">{job.errorRecords} Errors</span>}
          </div>
       </CardContent>
    </Card>
  );
}
