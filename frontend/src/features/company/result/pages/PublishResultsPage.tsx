import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { publishResultSchema, type PublishResultForm } from '../schemas/result-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { DUMMY_EXAMS } from '../utils/placeholder';
import { Send } from 'lucide-react';

export function PublishResultsPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PublishResultForm>({
    resolver: zodResolver(publishResultSchema),
    defaultValues: {
      publishMethod: 'Immediate',
      notifyCandidates: true,
    }
  });

  const publishMethod = watch('publishMethod');

  const onSubmit = (data: PublishResultForm) => {
    console.log(data);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Publish Results" 
        description="Make generated results visible to candidates and send notifications." 
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg">Publish Configuration</CardTitle>
          <CardDescription>Select the exam batch and set publication rules.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <label className="text-sm font-medium text-slate-700">Publish Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="Immediate" {...register('publishMethod')} className="text-indigo-600" />
                  <span className="text-sm text-slate-700">Immediate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="Scheduled" {...register('publishMethod')} className="text-indigo-600" />
                  <span className="text-sm text-slate-700">Scheduled Date & Time</span>
                </label>
              </div>
            </div>

            {publishMethod === 'Scheduled' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Schedule Date/Time <span className="text-red-500">*</span></label>
                <Input type="datetime-local" {...register('scheduledDate')} />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input type="checkbox" id="notify" {...register('notifyCandidates')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
              <label htmlFor="notify" className="text-sm text-slate-700 font-medium">Send SMS/Email Notifications to Candidates</label>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4 mr-2" />
                {publishMethod === 'Scheduled' ? 'Schedule Publish' : 'Publish Now'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
