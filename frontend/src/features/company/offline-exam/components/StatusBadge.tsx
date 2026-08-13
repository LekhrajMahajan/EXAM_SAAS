import React from 'react';
import type { AttendanceStatus, EvaluationStatus, InvigilatorDutyStatus, MaterialStatus, OmrStatus, SessionStatus } from '../types';

type AnyStatus = SessionStatus | AttendanceStatus | OmrStatus | EvaluationStatus | InvigilatorDutyStatus | MaterialStatus;

const STATUS_MAP: Record<string, string> = {
  // Session
  Scheduled: 'bg-sky-100 text-sky-700 border-sky-200',
  Running: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Completed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  Postponed: 'bg-amber-100 text-amber-700 border-amber-200',
  // Attendance
  Present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Absent: 'bg-red-100 text-red-700 border-red-200',
  Late: 'bg-orange-100 text-orange-700 border-orange-200',
  'Not Marked': 'bg-slate-100 text-slate-500 border-slate-200',
  // OMR
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Scanned: 'bg-sky-100 text-sky-700 border-sky-200',
  Processed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
  Recheck: 'bg-violet-100 text-violet-700 border-violet-200',
  // Evaluation
  'In Progress': 'bg-sky-100 text-sky-700 border-sky-200',
  Reviewed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  // Invigilator
  Assigned: 'bg-slate-100 text-slate-600 border-slate-200',
  Replaced: 'bg-orange-100 text-orange-700 border-orange-200',
  // Material
  'Pending Distribution': 'bg-amber-100 text-amber-700 border-amber-200',
  Distributed: 'bg-sky-100 text-sky-700 border-sky-200',
  Returned: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Partial Return': 'bg-orange-100 text-orange-700 border-orange-200',
};

export function StatusBadge({ status }: { status: AnyStatus }) {
  const cls = STATUS_MAP[status] ?? 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${cls}`}>
      {status}
    </span>
  );
}
