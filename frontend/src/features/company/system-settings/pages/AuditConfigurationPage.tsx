import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { History, Activity } from 'lucide-react';

export function AuditConfigurationPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Audit Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Audit Log Configuration" 
        description="Determine what system events are tracked and how long they are retained." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Retention Policies" icon={History}>
            <div className="space-y-4 max-w-sm">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Audit Log Retention (Days)</label>
                 <input 
                   type="number" 
                   defaultValue={90}
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                 />
                 <p className="text-xs text-slate-500">Logs older than this will be permanently deleted.</p>
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Log Level</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                    <option value="minimal">Minimal (Security & Access Only)</option>
                    <option value="standard" selected>Standard (Mutations & Access)</option>
                    <option value="verbose">Verbose (All Reads & Writes)</option>
                 </select>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Activity Tracking" icon={Activity}>
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Tracking Toggles Placeholder</label>
               <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 space-y-4">
                  <label className="flex items-center gap-3">
                     <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="font-medium text-slate-700">Track Administrator Logins</span>
                  </label>
                  <label className="flex items-center gap-3">
                     <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="font-medium text-slate-700">Track Exam Configuration Changes</span>
                  </label>
                  <label className="flex items-center gap-3">
                     <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="font-medium text-slate-700">Track Candidate Result Modifications</span>
                  </label>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
