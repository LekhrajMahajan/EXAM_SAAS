import React from 'react';
import type { ActivityLogRecord } from '../types';
import { Info, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ActivityTimelineProps {
  logs: ActivityLogRecord[];
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
  
  if (logs.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No recent activity logs.</p>
      </div>
    );
  }

  const getLogIcon = (severity: string) => {
    switch(severity) {
      case 'Info': return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200"><Info className="w-4 h-4" /></div>;
      case 'Warning': return <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200"><AlertTriangle className="w-4 h-4" /></div>;
      case 'Error': return <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center border border-red-200"><AlertCircle className="w-4 h-4" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200"><Info className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6">
       <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity Logs</h3>
       
       <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
         {logs.map((log) => (
           <div key={log.id} className="relative pl-8">
             <div className="absolute -left-4 top-0 bg-white">
               {getLogIcon(log.severity)}
             </div>
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
               <h4 className="text-sm font-semibold text-slate-900">
                 {log.candidateName} <span className="text-slate-500 font-normal ml-1">performed</span> {log.action}
               </h4>
               <span className="flex items-center text-xs text-slate-500 font-mono">
                 <Clock className="w-3.5 h-3.5 mr-1" />
                 {log.timestamp}
               </span>
             </div>
             
             <p className="text-sm text-slate-600">
               {log.remarks}
             </p>
           </div>
         ))}
       </div>
    </div>
  );
}
