import React from 'react';
import type { NotificationPriority, NotificationStatus, DeliveryMethod } from '../types';

export function NotificationBadge({ type, value }: { type: 'priority' | 'status' | 'method', value: string }) {
  if (type === 'priority') {
    switch (value as NotificationPriority) {
      case 'Urgent': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">{value}</span>;
      case 'High': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">{value}</span>;
      case 'Normal': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">{value}</span>;
      case 'Low': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">{value}</span>;
    }
  }

  if (type === 'status') {
    switch (value as NotificationStatus) {
      case 'Delivered': return <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Delivered</span>;
      case 'Pending': return <span className="flex items-center gap-1 text-amber-600 font-semibold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Pending</span>;
      case 'Failed': return <span className="flex items-center gap-1 text-red-600 font-semibold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Failed</span>;
      case 'Scheduled': return <span className="flex items-center gap-1 text-indigo-600 font-semibold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Scheduled</span>;
      case 'Draft': return <span className="flex items-center gap-1 text-slate-500 font-semibold text-xs"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Draft</span>;
    }
  }
  
  if (type === 'method') {
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">{value}</span>;
  }

  return null;
}
