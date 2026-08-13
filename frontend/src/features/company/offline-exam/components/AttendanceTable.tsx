import React from 'react';
import type { AttendanceRecord } from '../types';
import { StatusBadge } from './StatusBadge';

export function AttendanceTable({ records }: { records: AttendanceRecord[] }) {
  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const late = records.filter(r => r.status === 'Late').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-emerald-800 font-bold">
          ✓ Present: {present}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-800 font-bold">
          ✗ Absent: {absent}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-orange-800 font-bold">
          ⏱ Late: {late}
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 font-bold">
          Total: {records.length}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Candidate</th>
                <th className="px-4 py-3 font-semibold">Roll Number</th>
                <th className="px-4 py-3 font-semibold">Room</th>
                <th className="px-4 py-3 font-semibold">Seat</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold">Marked At</th>
                <th className="px-4 py-3 font-semibold">Marked By</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">{r.candidateName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-indigo-700">{r.rollNumber}</td>
                  <td className="px-4 py-3">{r.room}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.seatNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center"><StatusBadge status={r.status} /></div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.markedAt ? new Date(r.markedAt).toLocaleTimeString() : '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.markedBy ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
