import React from 'react';
import { Camera, Mic, MonitorSmartphone, Monitor, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

export function SecurityStatusPanel() {
  const statuses = [
    { label: 'Camera', icon: Camera, active: true },
    { label: 'Microphone', icon: Mic, active: true },
    { label: 'Screen Lock', icon: MonitorSmartphone, active: true },
    { label: 'Multi-monitor', icon: Monitor, active: true, safe: true },
    { label: 'Developer Tools', icon: ShieldCheck, active: true, safe: true },
    { label: 'Network', icon: Activity, active: true },
  ];

  return (
    <div className="bg-slate-50 flex-1 p-4 overflow-y-auto">
       <h4 className="font-semibold text-slate-800 mb-4 text-sm flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-indigo-600" />
         Security Monitors
       </h4>
       
       <div className="space-y-3">
         {statuses.map((status, i) => (
           <div key={i} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm">
             <div className="flex items-center gap-3">
               <div className={cn(
                 "w-8 h-8 rounded flex items-center justify-center",
                 status.active ? (status.safe === false ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600") : "bg-slate-100 text-slate-400"
               )}>
                 <status.icon className="w-4 h-4" />
               </div>
               <span className="text-sm font-medium text-slate-700">{status.label}</span>
             </div>
             
             <div className="flex items-center">
                {status.active ? (
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    status.safe === false ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  )}></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
             </div>
           </div>
         ))}
       </div>
       
       <div className="mt-6 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
         <p className="text-xs text-indigo-800 leading-relaxed text-center font-medium">
           Proctoring AI is active. Any suspicious activity will be recorded and may lead to disqualification.
         </p>
       </div>
    </div>
  );
}
