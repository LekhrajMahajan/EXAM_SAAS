import React from 'react';

const STATUS_COLORS: Record<string, string> = {
  // Staff Status
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
  Suspended: 'bg-red-100 text-red-700 border-red-200',
  // Duty Status
  Assigned: 'bg-sky-100 text-sky-700 border-sky-200',
  Accepted: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Declined: 'bg-red-100 text-red-700 border-red-200',
  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Missed: 'bg-orange-100 text-orange-700 border-orange-200',
  // Attendance Status
  'Checked In': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Checked Out': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Absent: 'bg-red-100 text-red-700 border-red-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  // Incident Severity
  Low: 'bg-sky-100 text-sky-700 border-sky-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
  // Incident Status
  Open: 'bg-amber-100 text-amber-700 border-amber-200',
  Investigating: 'bg-sky-100 text-sky-700 border-sky-200',
  Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
  // Violation Actions
  Warning: 'bg-amber-100 text-amber-700 border-amber-200',
  Dismissed: 'bg-orange-100 text-orange-700 border-orange-200',
  Debarred: 'bg-red-100 text-red-700 border-red-200',
  'Under Review': 'bg-sky-100 text-sky-700 border-sky-200',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] || 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${cls}`}>
      {status}
    </span>
  );
}
