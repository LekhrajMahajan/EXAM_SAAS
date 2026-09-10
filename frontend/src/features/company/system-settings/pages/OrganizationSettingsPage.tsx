import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { Building2, MapPin } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSettingsSchema, type OrganizationSettingsForm } from '../schemas/settings-schemas';

export function OrganizationSettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<OrganizationSettingsForm>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      companyName: 'Global Exams Ltd.',
      taxId: '12-3456789',
      supportEmail: 'support@globalexams.com',
      supportPhone: '+1 (555) 123-4567',
      streetAddress: '123 Tech Boulevard, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US'
    }
  });

  const onSubmit = async (data: OrganizationSettingsForm) => {
    // TODO: Send data to API
    console.warn('Saved Organization Settings:', data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Organization Settings" 
        description="Manage company details, contact information, and physical addresses." 
      />
      
      <ConfigurationForm onSubmit={handleSubmit(onSubmit)}>
         <SectionCard title="Company Information" icon={Building2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Legal Company Name</label>
                 <Input {...register('companyName')} placeholder="e.g. Global Exams Ltd." />
                 {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Tax ID / EIN</label>
                 <Input {...register('taxId')} placeholder="e.g. 12-3456789" />
                 {errors.taxId && <p className="text-xs text-red-500">{errors.taxId.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Support Email</label>
                 <Input type="email" {...register('supportEmail')} placeholder="e.g. support@company.com" />
                 {errors.supportEmail && <p className="text-xs text-red-500">{errors.supportEmail.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Support Phone</label>
                 <Input type="tel" {...register('supportPhone')} placeholder="e.g. +1 (555) 123-4567" />
                 {errors.supportPhone && <p className="text-xs text-red-500">{errors.supportPhone.message}</p>}
               </div>
               <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Organization Logo Placeholder</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex items-center justify-center bg-slate-50 text-slate-500 text-sm cursor-pointer hover:bg-slate-100 transition-colors">
                     Drag and drop logo image here or click to browse
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Headquarters Address" icon={MapPin}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="sm:col-span-2 space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Street Address</label>
                 <Input {...register('streetAddress')} placeholder="e.g. 123 Tech Boulevard, Suite 400" />
                 {errors.streetAddress && <p className="text-xs text-red-500">{errors.streetAddress.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">City</label>
                 <Input {...register('city')} placeholder="e.g. San Francisco" />
                 {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">State / Province</label>
                 <Input {...register('state')} placeholder="e.g. CA" />
                 {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Postal Code</label>
                 <Input {...register('postalCode')} placeholder="e.g. 94105" />
                 {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode.message}</p>}
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Country</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('country')}
                 >
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                 </select>
                 {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
