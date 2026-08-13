import React from 'react';
import type { EvaluationSheet } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Edit2 } from 'lucide-react';

export function EvaluationTable({ sheets }: { sheets: EvaluationSheet[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Candidate</th>
              <th className="px-4 py-3 font-semibold">Roll Number</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Evaluator</th>
              <th className="px-4 py-3 font-semibold text-right">Marks</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map(sheet => (
              <tr key={sheet.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-900">{sheet.candidateName}</td>
                <td className="px-4 py-3 font-mono text-xs text-indigo-700">{sheet.rollNumber}</td>
                <td className="px-4 py-3">{sheet.subject}</td>
                <td className="px-4 py-3 text-slate-700">{sheet.evaluatorName || <span className="text-slate-300 italic">Unassigned</span>}</td>
                <td className="px-4 py-3 text-right">
                  {sheet.marksObtained !== undefined
                    ? <span className="font-bold text-slate-900">{sheet.marksObtained} <span className="text-slate-400 font-normal">/ {sheet.maxMarks}</span></span>
                    : <span className="text-slate-300">—</span>
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center"><StatusBadge status={sheet.status} /></div>
                </td>
                <td className="px-4 py-3 text-right">
                  {(sheet.status === 'Pending' || sheet.status === 'In Progress') && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                      <Edit2 className="w-4 h-4" />
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
