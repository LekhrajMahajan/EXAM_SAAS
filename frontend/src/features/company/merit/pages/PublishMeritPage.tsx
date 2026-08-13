import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { publishMeritSchema, type PublishMeritForm } from '../schemas/merit-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { DUMMY_EXAMS, DUMMY_MERIT_TYPES } from '../utils/placeholder';
import { Send, Globe } from 'lucide-react';

export function PublishMeritPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PublishMeritForm>({
    resolver: zodResolver(publishMeritSchema),
    defaultValues: {
      publishMethod: 'Immediate',
    }
  });

  const publishMethod = watch('publishMethod');

  const onSubmit = (data: PublishMeritForm) => {
    console.log(data);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Publish Merit List" 
        description="Make ranked merit lists visible to candidates and trigger allocation workflows." 
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
             <Globe className="w-5 h-5 text-indigo-500" />
             Publication Settings
          </CardTitle>
          <CardDescription>Select the exact merit list version to make public.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Exam to Publish <span className="text-red-500">*</span></label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('exam')}
                 >
                   <option value="">Select Exam</option>
                   {DUMMY_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                 </select>
                 {errors.exam && <p className="text-xs text-red-500">{errors.exam.message}</p>}
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Merit Type <span className="text-red-500">*</span></label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   {...register('meritType')}
                 >
                   <option value="">Select Merit Type</option>
                   {DUMMY_MERIT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                 </select>
                 {errors.meritType && <p className="text-xs text-red-500">{errors.meritType.message}</p>}
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Publish Timeline</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100">
                  <input type="radio" value="Immediate" {...register('publishMethod')} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">Publish Immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100">
                  <input type="radio" value="Scheduled" {...register('publishMethod')} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">Schedule Date & Time</span>
                </label>
              </div>
            </div>

            {publishMethod === 'Scheduled' && (
              <div className="space-y-2 bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                <label className="text-sm font-medium text-indigo-900">Select Schedule Date/Time <span className="text-red-500">*</span></label>
                <Input type="datetime-local" {...register('scheduledDate')} className="bg-white" />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
              <input type="checkbox" id="notify" {...register('notifyCandidates')} className="w-5 h-5 text-indigo-600 rounded border-slate-300" />
              <label htmlFor="notify" className="text-sm text-slate-700 font-bold">Push Notifications & Emails to Ranked Candidates</label>
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">
                <Send className="w-4 h-4 mr-2" />
                {publishMethod === 'Scheduled' ? 'Schedule Publication' : 'Confirm & Publish'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
