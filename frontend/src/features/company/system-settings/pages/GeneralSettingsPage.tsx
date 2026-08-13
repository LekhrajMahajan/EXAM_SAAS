import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { Settings, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalSettingsSchema, type GeneralSettingsForm } from '../schemas/settings-schemas';

export function GeneralSettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      platformName: 'Practice Exam Pro',
      timezone: 'UTC',
      language: 'en-US',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h'
    }
  });

  const onSubmit = async (data: GeneralSettingsForm) => {
    console.log('Saved General Settings:', data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="General Settings" 
        description="Configure core platform identity, localization, and date formatting." 
      />
      
      <ConfigurationForm onSubmit={handleSubmit(onSubmit)}>
         <SectionCard title="Platform Details" icon={Settings}>
            <div className="space-y-4 max-w-md">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Platform Name</label>
                 <input 
                   type="text" 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('platformName')}
                 />
                 {errors.platformName && <p className="text-xs text-red-500">{errors.platformName.message}</p>}
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Localization & Formatting" icon={Globe}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Timezone</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('timezone')}
                 >
                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                 </select>
                 {errors.timezone && <p className="text-xs text-red-500">{errors.timezone.message}</p>}
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Default Language</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('language')}
                 >
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                 </select>
                 {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Date Format</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('dateFormat')}
                 >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                 </select>
                 {errors.dateFormat && <p className="text-xs text-red-500">{errors.dateFormat.message}</p>}
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Time Format</label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('timeFormat')}
                 >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                 </select>
                 {errors.timeFormat && <p className="text-xs text-red-500">{errors.timeFormat.message}</p>}
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
