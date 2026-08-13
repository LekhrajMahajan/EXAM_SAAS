import React from 'react';
import type { ReportRecord } from '../types';
import { Button } from '@/shared/components/ui/button';
import { DownloadCloud, PlayCircle, Clock } from 'lucide-react';
import { ExportDialog } from './ExportDialog';
import { ScheduleDialog } from './ScheduleDialog';

interface ReportTableProps {
  records: ReportRecord[];
}

export function ReportTable({ records }: ReportTableProps) {
  
  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">Report Name</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Last Generated</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                   <div className="font-semibold text-slate-900">{record.name}</div>
                   <div className="text-xs text-slate-500 max-w-md truncate">{record.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                     {record.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                  {record.lastGenerated || 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.status === 'Ready' ? (
                     <span className="text-emerald-600 font-semibold text-xs">Ready</span>
                  ) : record.status === 'Generating' ? (
                     <span className="text-amber-600 font-semibold text-xs flex items-center gap-1"><Clock className="w-3 h-3 animate-spin"/> Generating</span>
                  ) : (
                     <span className="text-red-600 font-semibold text-xs">Failed</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                     <Button variant="outline" size="sm" className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50" disabled={record.status !== 'Ready'}>
                       <PlayCircle className="w-4 h-4 mr-2" /> Run Now
                     </Button>
                     <ExportDialog 
                       trigger={
                         <Button variant="outline" size="sm" className="bg-white" disabled={record.status !== 'Ready'}>
                           <DownloadCloud className="w-4 h-4" />
                         </Button>
                       }
                     />
                     <ScheduleDialog 
                       trigger={
                         <Button variant="ghost" size="sm" className="text-slate-500">
                           <Clock className="w-4 h-4" />
                         </Button>
                       }
                     />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
