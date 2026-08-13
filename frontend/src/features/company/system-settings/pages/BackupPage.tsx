import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_BACKUPS } from '../utils/placeholder';
import { BackupCard } from '../components/BackupCard';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { Clock } from 'lucide-react';

export function BackupPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Backup Settings');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader 
        title="Backup & Restore" 
        description="Configure automated snapshots and restore from previous points in time." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Automated Backup Schedule" icon={Clock}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Frequency</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                 </select>
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Retention Period (Days)</label>
                 <input 
                   type="number" 
                   defaultValue={30}
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                 />
               </div>
               <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-3">
                     <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Backup to external Cloud Storage integration (AWS S3)</span>
                  </label>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>

      <div className="pt-6">
         <BackupCard history={DUMMY_BACKUPS} />
      </div>
    </div>
  );
}
