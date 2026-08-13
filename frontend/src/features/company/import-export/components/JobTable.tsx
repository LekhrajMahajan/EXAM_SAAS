import React from 'react';
import type { ImportExportJob, JobStatus } from '../types';
import { CheckCircle2, AlertCircle, Clock, Loader2, FileDown } from 'lucide-react';

export function StatusBadge({ status }: { status: JobStatus }) {
  switch (status) {
    case 'Completed': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
    case 'Failed': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200"><AlertCircle className="w-3 h-3" /> {status}</span>;
    case 'Partial Success': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200"><AlertCircle className="w-3 h-3" /> Partial</span>;
    case 'Processing': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"><Loader2 className="w-3 h-3 animate-spin" /> {status}</span>;
    case 'Pending': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"><Clock className="w-3 h-3" /> {status}</span>;
  }
}

export function JobTable({ jobs }: { jobs: ImportExportJob[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Job ID</th>
              <th scope="col" className="px-4 py-3 font-semibold">Type</th>
              <th scope="col" className="px-4 py-3 font-semibold">Module</th>
              <th scope="col" className="px-4 py-3 font-semibold">Progress</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Created</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-500">{job.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.type === 'Import' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>{job.type}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{job.module}</td>
                <td className="px-4 py-3 min-w-[150px]">
                   <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                         <div className={`h-1.5 rounded-full ${job.status === 'Failed' ? 'bg-red-500' : job.type === 'Import' ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: `${job.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{job.progress}%</span>
                   </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <div className="flex justify-center"><StatusBadge status={job.status} /></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="text-xs">{new Date(job.createdAt).toLocaleTimeString()}</div>
                   <div className="text-[10px] text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                   {job.status === 'Pending' || job.status === 'Processing' ? (
                     <button className="text-xs font-bold text-red-600 hover:text-red-700 uppercase">Cancel</button>
                   ) : job.type === 'Export' && job.status === 'Completed' ? (
                     <button className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase">
                        <FileDown className="w-3.5 h-3.5" /> Download
                     </button>
                   ) : (
                     <span className="text-xs text-slate-400 italic">No actions</span>
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
