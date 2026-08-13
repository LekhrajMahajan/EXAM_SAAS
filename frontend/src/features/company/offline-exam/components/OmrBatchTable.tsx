import React from 'react';
import type { OmrBatch } from '../types';
import { StatusBadge } from './StatusBadge';
import { ScanLine } from 'lucide-react';

export function OmrBatchTable({ batches }: { batches: OmrBatch[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Batch Code</th>
              <th className="px-4 py-3 font-semibold">Exam</th>
              <th className="px-4 py-3 font-semibold text-center">Total</th>
              <th className="px-4 py-3 font-semibold text-center">Processed</th>
              <th className="px-4 py-3 font-semibold text-center">Pending</th>
              <th className="px-4 py-3 font-semibold text-center">Rejected</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
              <th className="px-4 py-3 font-semibold">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => {
              const pct = batch.totalSheets > 0 ? Math.round((batch.processedSheets / batch.totalSheets) * 100) : 0;
              return (
                <tr key={batch.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ScanLine className="w-4 h-4 text-indigo-400" />
                      <span className="font-mono text-xs font-bold text-indigo-700">{batch.batchCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{batch.exam}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-900">{batch.totalSheets}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="font-bold text-emerald-700">{batch.processedSheets}</div>
                    <div className="text-[10px] text-slate-400">{pct}%</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-amber-700">{batch.pendingSheets}</td>
                  <td className="px-4 py-3 text-center font-bold text-red-600">{batch.rejectedSheets}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center"><StatusBadge status={batch.status} /></div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                    {batch.uploadedAt ? new Date(batch.uploadedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
