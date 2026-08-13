import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { Building2, MapPin } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function OrganizationSettingsPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Organization Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Organization Settings" 
        description="Manage company details, contact information, and physical addresses." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Company Information" icon={Building2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Legal Company Name</label>
                 <Input defaultValue="Global Exams Ltd." />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Tax ID / EIN</label>
                 <Input defaultValue="12-3456789" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Support Email</label>
                 <Input defaultValue="support@globalexams.com" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Support Phone</label>
                 <Input defaultValue="+1 (555) 123-4567" />
               </div>
               <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Organization Logo Placeholder</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
                     Drag and drop logo image here
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Headquarters Address" icon={MapPin}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="sm:col-span-2 space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Street Address</label>
                 <Input defaultValue="123 Tech Boulevard, Suite 400" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">City</label>
                 <Input defaultValue="San Francisco" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">State / Province</label>
                 <Input defaultValue="CA" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Postal Code</label>
                 <Input defaultValue="94105" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Country</label>
                 <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                 </select>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
