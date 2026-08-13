import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportAuditSchema, type ExportAuditForm } from '../schemas/audit-schemas';
import { Download, FileText, FileSpreadsheet, Lock } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function ExportDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExportAuditForm>({
    resolver: zodResolver(exportAuditSchema),
    defaultValues: {
      dateRange: 'Today',
      modules: ['Authentication', 'Security'],
      severity: ['Critical', 'High'],
      format: 'CSV',
      passwordProtect: false
    }
  });

  const dateRange = watch('dateRange');
  const passwordProtect = watch('passwordProtect');

  const onSubmit = (data: ExportAuditForm) => {
    console.log("Exporting Logs: ", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-indigo-500" /> Export Audit Logs</DialogTitle>
          <DialogDescription>Generate a downloadable report of system activity based on your criteria.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
           
           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">1. Date Range</h4>
              <select {...register('dateRange')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                 <option value="Today">Today</option>
                 <option value="Last 7 Days">Last 7 Days</option>
                 <option value="Last 30 Days">Last 30 Days</option>
                 <option value="Custom">Custom Range</option>
              </select>
              
              {dateRange === 'Custom' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-700">Start Date</label>
                       <Input type="date" {...register('startDate')} />
                       {errors.startDate && <p className="text-[10px] text-red-500">{errors.startDate.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-700">End Date</label>
                       <Input type="date" {...register('endDate')} />
                    </div>
                 </div>
              )}
           </div>

           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">2. Data Selection</h4>
              
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modules to Include</label>
                 <div className="flex flex-wrap gap-3">
                    {['Authentication', 'Security', 'Exam', 'API', 'System'].map(mod => (
                       <label key={mod} className="flex items-center gap-2">
                          <input type="checkbox" value={mod} {...register('modules')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                          <span className="text-sm text-slate-700">{mod}</span>
                       </label>
                    ))}
                 </div>
                 {errors.modules && <p className="text-[10px] text-red-500">{errors.modules.message}</p>}
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Severity Levels</label>
                 <div className="flex flex-wrap gap-3">
                    {['Critical', 'High', 'Medium', 'Low'].map(sev => (
                       <label key={sev} className="flex items-center gap-2">
                          <input type="checkbox" value={sev} {...register('severity')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                          <span className="text-sm text-slate-700">{sev}</span>
                       </label>
                    ))}
                 </div>
                 {errors.severity && <p className="text-[10px] text-red-500">{errors.severity.message}</p>}
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">3. Export Format & Security</h4>
              
              <div className="flex gap-4">
                 <label className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 flex-1 transition-colors">
                    <input type="radio" value="CSV" {...register('format')} className="sr-only" />
                    <FileText className="w-8 h-8 mb-2 text-slate-400" />
                    <span className="font-bold text-sm">CSV File</span>
                 </label>
                 <label className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 flex-1 transition-colors">
                    <input type="radio" value="Excel" {...register('format')} className="sr-only" />
                    <FileSpreadsheet className="w-8 h-8 mb-2 text-emerald-500" />
                    <span className="font-bold text-sm">Excel File</span>
                 </label>
                 <label className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 flex-1 transition-colors">
                    <input type="radio" value="PDF" {...register('format')} className="sr-only" />
                    <FileText className="w-8 h-8 mb-2 text-red-500" />
                    <span className="font-bold text-sm">PDF Report</span>
                 </label>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-md space-y-3 mt-4">
                 <label className="flex items-center gap-2 font-medium text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" {...register('passwordProtect')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                    <Lock className="w-4 h-4 text-slate-400" /> Password Protect File
                 </label>
                 {passwordProtect && (
                    <div className="pl-6 space-y-1.5">
                       <Input type="password" {...register('password')} placeholder="Enter a secure password..." className="max-w-xs" />
                       {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
                    </div>
                 )}
              </div>
           </div>

           <DialogFooter className="pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 Generate Export
              </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
