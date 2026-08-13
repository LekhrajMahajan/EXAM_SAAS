import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { ClipboardCheck, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examPolicySchema, type ExamPolicyForm } from '../schemas/settings-schemas';

export function ExamPolicyPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ExamPolicyForm>({
    resolver: zodResolver(examPolicySchema),
    defaultValues: {
      defaultDuration: 120,
      defaultNegativeMarking: 25,
      autoSubmitEnabled: true,
      lateEntryAllowed: false,
      lateEntryGracePeriod: 0
    }
  });

  const onSubmit = async (data: ExamPolicyForm) => {
    console.log('Saved Exam Policy Settings:', data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Global Exam Policy Defaults" 
        description="Set the baseline rules for all newly created exams. These can be overridden per exam." 
      />
      
      <ConfigurationForm onSubmit={handleSubmit(onSubmit)}>
         <SectionCard title="Assessment Defaults" icon={ClipboardCheck}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Default Duration (Minutes)</label>
                 <input 
                   type="number" 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('defaultDuration', { valueAsNumber: true })}
                 />
                 {errors.defaultDuration && <p className="text-xs text-red-500">{errors.defaultDuration.message}</p>}
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Default Negative Marking (%)</label>
                 <input 
                   type="number" 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('defaultNegativeMarking', { valueAsNumber: true })}
                 />
                 {errors.defaultNegativeMarking && <p className="text-xs text-red-500">{errors.defaultNegativeMarking.message}</p>}
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Submission & Entry Rules" icon={Clock}>
            <div className="space-y-6">
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Auto Submit Placeholder</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                     <p className="text-sm text-slate-700 font-bold mb-2">Automatically submit exam when time expires.</p>
                     <div className="h-8 w-14 bg-indigo-600 rounded-full flex items-center p-1">
                        <div className="w-6 h-6 bg-white rounded-full translate-x-6"></div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-md">
                     <input type="checkbox" {...register('lateEntryAllowed')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Allow Late Entry</span>
                  </label>
                  
                  <div className="space-y-1.5 max-w-xs">
                     <label className="text-sm font-medium text-slate-700">Late Entry Grace Period (Minutes)</label>
                     <input 
                        type="number" 
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                        {...register('lateEntryGracePeriod', { valueAsNumber: true })}
                     />
                     <p className="text-xs text-slate-500">Only applies if late entry is allowed.</p>
                     {errors.lateEntryGracePeriod && <p className="text-xs text-red-500">{errors.lateEntryGracePeriod.message}</p>}
                  </div>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
