import React from 'react';
import type { ImportExportJob } from '../types';
import { StatusBadge } from './JobTable';
import { Link } from 'react-router-dom';
import { Eye, FileDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function HistoryTable({ jobs }: { jobs: ImportExportJob[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Type & Module</th>
              <th scope="col" className="px-4 py-3 font-semibold">File Details</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Records</th>
              <th scope="col" className="px-4 py-3 font-semibold">Timestamp</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.type === 'Import' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>{job.type}</span>
                      <span className="font-medium text-slate-900">{job.module}</span>
                   </div>
                </td>
                <td className="px-4 py-3">
                   <div className="font-mono text-xs text-slate-600 truncate max-w-[200px]" title={job.fileName}>{job.fileName}</div>
                   {job.format && <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Format: {job.format}</div>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <div className="flex justify-center"><StatusBadge status={job.status} /></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <div className="text-xs font-bold text-slate-900">{job.successRecords} <span className="font-normal text-slate-400">/ {job.totalRecords}</span></div>
                   {job.errorRecords > 0 && <div className="text-[10px] text-red-500 font-bold mt-0.5">{job.errorRecords} Errors</div>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="text-xs">{job.completedAt ? new Date(job.completedAt).toLocaleString() : 'N/A'}</div>
                   <div className="text-[10px] text-slate-400">By {job.createdBy}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                   {job.errorRecords > 0 && (
                     <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" asChild>
                        <Link to={`/company/import-export/errors?jobId=${job.id}`}><Eye className="w-4 h-4 mr-1" /> Errors</Link>
                     </Button>
                   )}
                   {job.type === 'Export' && job.status === 'Completed' && (
                     <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                        <FileDown className="w-4 h-4" />
                     </Button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
