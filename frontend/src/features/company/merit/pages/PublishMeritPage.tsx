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

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="bg-muted/50 border-b border-border">
          <CardTitle className="text-lg flex items-center gap-2">
             <Globe className="w-5 h-5 text-primary" />
             Publication Settings
          </CardTitle>
          <CardDescription>Select the exact merit list version to make public.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-foreground">Exam to Publish <span className="text-destructive">*</span></label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                   {...register('exam')}
                 >
                   <option value="">Select Exam</option>
                   {DUMMY_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                 </select>
                 {errors.exam && <p className="text-xs text-destructive">{errors.exam.message}</p>}
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-medium text-foreground">Merit Type <span className="text-destructive">*</span></label>
                 <select 
                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                   {...register('meritType')}
                 >
                   <option value="">Select Merit Type</option>
                   {DUMMY_MERIT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                 </select>
                 {errors.meritType && <p className="text-xs text-destructive">{errors.meritType.message}</p>}
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Publish Timeline</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-card border border-border px-4 py-2 rounded-lg hover:bg-muted/50">
                  <input type="radio" value="Immediate" {...register('publishMethod')} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">Publish Immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-card border border-border px-4 py-2 rounded-lg hover:bg-muted/50">
                  <input type="radio" value="Scheduled" {...register('publishMethod')} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">Schedule Date & Time</span>
                </label>
              </div>
            </div>

            {publishMethod === 'Scheduled' && (
              <div className="space-y-2 bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <label className="text-sm font-medium text-primary">Select Schedule Date/Time <span className="text-destructive">*</span></label>
                <Input type="datetime-local" {...register('scheduledDate')} className="bg-background" />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <input type="checkbox" id="notify" {...register('notifyCandidates')} className="w-5 h-5 text-primary rounded border-input" />
              <label htmlFor="notify" className="text-sm text-foreground font-bold">Push Notifications & Emails to Ranked Candidates</label>
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="submit" className="font-bold px-8">
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
