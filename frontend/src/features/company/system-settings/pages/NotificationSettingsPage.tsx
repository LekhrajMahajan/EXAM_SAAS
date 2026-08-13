import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { BellRing, Smartphone, Mail } from 'lucide-react';

export function NotificationSettingsPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Notification Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Global Notifications" 
        description="Configure which events trigger automated notifications to candidates and staff." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Email Notifications" icon={Mail}>
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Email Trigger Placeholder</label>
               <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded">
                     <span className="font-medium text-slate-700">New Registration Welcome Email</span>
                     <div className="h-6 w-11 bg-indigo-600 rounded-full flex items-center p-0.5"><div className="w-5 h-5 bg-white rounded-full translate-x-5"></div></div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded">
                     <span className="font-medium text-slate-700">Exam Reminder (24h before)</span>
                     <div className="h-6 w-11 bg-indigo-600 rounded-full flex items-center p-0.5"><div className="w-5 h-5 bg-white rounded-full translate-x-5"></div></div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded">
                     <span className="font-medium text-slate-700">Result Published Alert</span>
                     <div className="h-6 w-11 bg-slate-300 rounded-full flex items-center p-0.5"><div className="w-5 h-5 bg-white rounded-full"></div></div>
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="SMS Notifications" icon={Smartphone}>
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">SMS Trigger Placeholder</label>
               <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded">
                     <span className="font-medium text-slate-700">OTP for Login/Verification</span>
                     <div className="h-6 w-11 bg-indigo-600 rounded-full flex items-center p-0.5"><div className="w-5 h-5 bg-white rounded-full translate-x-5"></div></div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded">
                     <span className="font-medium text-slate-700">Admit Card Generated Alert</span>
                     <div className="h-6 w-11 bg-slate-300 rounded-full flex items-center p-0.5"><div className="w-5 h-5 bg-white rounded-full"></div></div>
                  </div>
               </div>
            </div>
         </SectionCard>
         
         <SectionCard title="Push Notifications" icon={BellRing}>
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Push Notification Placeholder</label>
               <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                  <p>In-app push notifications for desktop browsers and mobile app users.</p>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
