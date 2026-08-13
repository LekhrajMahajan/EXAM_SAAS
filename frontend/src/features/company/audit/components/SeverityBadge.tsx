import React from 'react';
import type { AuditSeverity } from '../types';

export function SeverityBadge({ severity }: { severity: AuditSeverity }) {
  switch (severity) {
    case 'Critical': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">{severity}</span>;
    case 'High': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">{severity}</span>;
    case 'Medium': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">{severity}</span>;
    case 'Low': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">{severity}</span>;
  }
  return null;
}
