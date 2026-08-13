import React from 'react';
import type { DutyAllocation } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Edit2, Eye } from 'lucide-react';

export function DutyTable({ duties }: { duties: DutyAllocation[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Staff Member</th>
              <th className="px-4 py-3 font-semibold">Exam & Date</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Shift</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {duties.map(duty => (
              <tr key={duty.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{duty.staffName}</div>
                  <div className="text-xs text-indigo-600 font-medium mt-0.5">{duty.role}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-800">{duty.exam}</div>
                  <div className="text-xs text-slate-500">{new Date(duty.date).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{duty.center}</div>
                  {duty.room && <div className="text-xs text-slate-500">{duty.building}, {duty.room}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {duty.shift}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center"><StatusBadge status={duty.status} /></div>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                    <Edit2 className="w-4 h-4" />
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
