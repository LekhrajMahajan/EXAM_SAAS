import React from 'react';
import type { ActivityLog } from '../types';
import { LogIn, PlayCircle, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

export function ActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  const getIcon = (action: string) => {
    switch (action) {
      case 'Login': return <LogIn className="w-4 h-4 text-sky-500" />;
      case 'Duty Started': return <PlayCircle className="w-4 h-4 text-indigo-500" />;
      case 'Duty Completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Incident Created': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'Violation Reported': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-slate-400" />;
    }
  };

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {logs.map((log, idx) => (
        <div key={log.id} className="relative flex items-start justify-between group">
          <div className="flex items-start w-full">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-sm z-10 group-hover:border-indigo-400 transition-colors mr-4">
              {getIcon(log.action)}
            </div>
            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-slate-500 text-sm mx-2">by</span>
                  <span className="font-bold text-indigo-700 text-sm">{log.staffName}</span>
                </div>
                <div className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  {log.timestamp}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{log.details}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
