import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { Mail, Server } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function EmailConfigurationPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Email Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Email Configuration" 
        description="Configure SMTP settings or connect a third-party email provider like SendGrid or SES." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="SMTP Server Details" icon={Server}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">SMTP Host</label>
                 <Input defaultValue="smtp.sendgrid.net" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">SMTP Port</label>
                 <Input defaultValue="587" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Username</label>
                 <Input defaultValue="apikey" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Password</label>
                 <Input type="password" defaultValue="••••••••••••••••" />
               </div>
               <div className="sm:col-span-2 space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Encryption</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                    <option value="TLS">TLS</option>
                    <option value="SSL">SSL</option>
                    <option value="None">None</option>
                 </select>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Sender Details & Templates" icon={Mail}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">From Name</label>
                 <Input defaultValue="Practice Exam Pro" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">From Email</label>
                 <Input defaultValue="noreply@globalexams.com" />
               </div>
               <div className="sm:col-span-2 mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                  <label className="text-sm font-medium text-slate-700">Email Template Placeholder</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                     A rich text editor or HTML uploader for email templates will be implemented here.
                  </div>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
