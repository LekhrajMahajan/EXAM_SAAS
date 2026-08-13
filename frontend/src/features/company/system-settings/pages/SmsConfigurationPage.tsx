import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { MessageSquare, Settings } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function SmsConfigurationPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved SMS Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="SMS Configuration" 
        description="Configure SMS Gateway credentials to send OTPs and critical alerts." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="SMS Gateway Credentials" icon={Settings}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="sm:col-span-2 space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Gateway Provider</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                    <option value="twilio">Twilio</option>
                    <option value="msg91">MSG91</option>
                    <option value="aws_sns">AWS SNS</option>
                 </select>
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Account SID / API Key</label>
                 <Input placeholder="Enter your Account SID or API Key" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Auth Token / Secret</label>
                 <Input type="password" defaultValue="••••••••••••••••" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Sender ID / From Number</label>
                 <Input defaultValue="+15551234567" />
               </div>
            </div>
         </SectionCard>

         <SectionCard title="SMS Templates" icon={MessageSquare}>
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">SMS Template Placeholder</label>
               <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 space-y-4">
                  <div>
                    <h5 className="font-bold text-slate-700 mb-1">OTP Template</h5>
                    <div className="font-mono text-xs bg-white p-3 rounded border border-slate-200">
                       Your OTP for Practice Exam Pro is {'{{OTP}}'}. It is valid for 5 minutes.
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-700 mb-1">Exam Reminder Template</h5>
                    <div className="font-mono text-xs bg-white p-3 rounded border border-slate-200">
                       Reminder: Your exam {'{{EXAM_NAME}}'} is scheduled for {'{{DATE_TIME}}'}.
                    </div>
                  </div>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
