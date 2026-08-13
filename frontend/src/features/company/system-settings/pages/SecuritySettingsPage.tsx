import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { ShieldAlert, MonitorSmartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { securitySettingsSchema, type SecuritySettingsForm } from '../schemas/settings-schemas';

export function SecuritySettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SecuritySettingsForm>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      passwordMinLength: 12,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: true,
      sessionTimeout: 30,
      maxFailedLogins: 5
    }
  });

  const onSubmit = async (data: SecuritySettingsForm) => {
    console.log('Saved Security Settings:', data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Security & Access Policies" 
        description="Enforce password complexity, session timeouts, and account locking rules." 
      />
      
      <ConfigurationForm onSubmit={handleSubmit(onSubmit)}>
         <SectionCard title="Password Policy" icon={ShieldAlert}>
            <div className="space-y-6">
               <div className="space-y-1.5 max-w-sm">
                 <label className="text-sm font-medium text-slate-700">Minimum Password Length</label>
                 <input 
                   type="number" 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('passwordMinLength', { valueAsNumber: true })}
                 />
                 {errors.passwordMinLength && <p className="text-xs text-red-500">{errors.passwordMinLength.message}</p>}
               </div>

               <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-md">
                     <input type="checkbox" {...register('requireUppercase')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Require at least one uppercase letter (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-md">
                     <input type="checkbox" {...register('requireNumber')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Require at least one number (0-9)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-md">
                     <input type="checkbox" {...register('requireSpecialChar')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Require at least one special character (!@#$%^&*)</span>
                  </label>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Session & Lockout Policies" icon={MonitorSmartphone}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Session Timeout (Minutes)</label>
                 <input 
                   type="number" 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('sessionTimeout', { valueAsNumber: true })}
                 />
                 <p className="text-xs text-slate-500">Auto-logout idle administrators.</p>
                 {errors.sessionTimeout && <p className="text-xs text-red-500">{errors.sessionTimeout.message}</p>}
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Max Failed Logins</label>
                 <input 
                   type="number" 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('maxFailedLogins', { valueAsNumber: true })}
                 />
                 <p className="text-xs text-slate-500">Lock account after X attempts.</p>
                 {errors.maxFailedLogins && <p className="text-xs text-red-500">{errors.maxFailedLogins.message}</p>}
               </div>

               <div className="sm:col-span-2 mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                  <label className="text-sm font-medium text-slate-700">Device Trust Placeholder</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                     UI for managing trusted devices and IP whitelisting will be integrated here.
                  </div>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
