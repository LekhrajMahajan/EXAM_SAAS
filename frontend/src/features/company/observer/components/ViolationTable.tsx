import React from 'react';
import type { ViolationReport } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Eye, MapPin } from 'lucide-react';

export function ViolationTable({ violations }: { violations: ViolationReport[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Report No.</th>
              <th className="px-4 py-3 font-semibold">Candidate Info</th>
              <th className="px-4 py-3 font-semibold">Violation Type</th>
              <th className="px-4 py-3 font-semibold">Location & Time</th>
              <th className="px-4 py-3 font-semibold text-center">Action Taken</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {violations.map(vio => (
              <tr key={vio.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-500">
                  {vio.reportNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{vio.candidateName}</div>
                  <div className="text-xs text-indigo-600 font-mono font-medium">{vio.candidateRollNo}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-rose-700">{vio.violationType}</div>
                  <div className="text-xs text-slate-500">Reported by: {vio.reportedBy}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-slate-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {vio.center}, {vio.room}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 ml-4.5">{vio.reportedAt}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={vio.actionTaken} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="h-8 bg-white text-xs">
                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
