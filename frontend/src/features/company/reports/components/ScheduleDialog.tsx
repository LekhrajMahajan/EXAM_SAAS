import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleReportSchema, type ScheduleReportForm } from '../schemas/report-schemas';
import { Clock, Save } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface ScheduleDialogProps {
  trigger: React.ReactNode;
}

export function ScheduleDialog({ trigger }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleReportForm>({
    resolver: zodResolver(scheduleReportSchema),
    defaultValues: {
      reportType: 'Custom Report',
      frequency: 'Weekly',
      format: 'PDF',
      active: true
    }
  });

  const onSubmit = (data: ScheduleReportForm) => {
    console.log("Schedule Created: ", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Schedule Report</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
           
           <div className="space-y-1.5">
             <label className="text-sm font-medium text-slate-700">Frequency</label>
             <select 
               className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
               {...register('frequency')}
             >
               <option value="Daily">Daily</option>
               <option value="Weekly">Weekly</option>
               <option value="Monthly">Monthly</option>
               <option value="Quarterly">Quarterly</option>
             </select>
             {errors.frequency && <p className="text-xs text-red-500">{errors.frequency.message}</p>}
           </div>

           <div className="space-y-1.5">
             <label className="text-sm font-medium text-slate-700">Format</label>
             <select 
               className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
               {...register('format')}
             >
               <option value="PDF">PDF</option>
               <option value="Excel">Excel</option>
               <option value="CSV">CSV</option>
             </select>
             {errors.format && <p className="text-xs text-red-500">{errors.format.message}</p>}
           </div>

           <div className="space-y-1.5">
             <label className="text-sm font-medium text-slate-700">Recipients (Email)</label>
             <Input 
               placeholder="admin@example.com, manager@example.com" 
               {...register('recipients')}
             />
             {errors.recipients && <p className="text-xs text-red-500">{errors.recipients.message}</p>}
             <p className="text-xs text-slate-500">Separate multiple emails with commas.</p>
           </div>

           <div className="pt-2 pb-2">
             <label className="flex items-center gap-3">
               <input type="checkbox" {...register('active')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
               <span className="text-sm font-medium text-slate-700">Active (Run Schedule immediately)</span>
             </label>
           </div>

           <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 <Save className="w-4 h-4 mr-2" />
                 Save Schedule
              </Button>
           </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
