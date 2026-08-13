import React from 'react';
import type { ErrorRecord } from '../types';
import { AlertCircle } from 'lucide-react';

export function ErrorTable({ errors }: { errors: ErrorRecord[] }) {
  return (
    <div className="bg-white rounded-lg border border-red-200 overflow-hidden shadow-sm">
      <div className="bg-red-50 p-4 border-b border-red-200 flex items-start gap-3">
         <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
         <div>
            <h3 className="font-bold text-red-900">Validation Errors Detected</h3>
            <p className="text-sm text-red-700 mt-1">The following rows failed validation and were skipped during import.</p>
         </div>
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-sm text-left text-slate-600 relative">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold w-16 text-center">Row</th>
              <th scope="col" className="px-4 py-3 font-semibold">Error Type</th>
              <th scope="col" className="px-4 py-3 font-semibold">Message</th>
              <th scope="col" className="px-4 py-3 font-semibold">Raw Data Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((error) => (
              <tr key={error.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 text-center font-mono font-bold text-slate-500">#{error.rowNumber}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">{error.errorType}</span>
                </td>
                <td className="px-4 py-3 text-red-600 font-medium">{error.errorMessage}</td>
                <td className="px-4 py-3">
                   <div className="font-mono text-xs text-slate-500 bg-slate-100 p-2 rounded max-w-md truncate" title={error.data}>{error.data}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
