import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportReportSchema, type ExportReportForm } from '../schemas/report-schemas';
import { DownloadCloud, FileText, FileSpreadsheet, FileJson } from 'lucide-react';

interface ExportDialogProps {
  trigger: React.ReactNode;
}

export function ExportDialog({ trigger }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ExportReportForm>({
    resolver: zodResolver(exportReportSchema),
    defaultValues: {
      format: 'PDF',
      includeCharts: true,
      includeRawData: false
    }
  });

  const onSubmit = (data: ExportReportForm) => {
    console.log("Export Triggered: ", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
           
           <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer">
                 <input type="radio" value="PDF" {...register('format')} className="peer sr-only" />
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-all">
                    <FileText className="w-8 h-8 mb-2 text-slate-400 peer-checked:text-indigo-600" />
                    <span className="text-sm font-bold">PDF</span>
                 </div>
              </label>
              <label className="cursor-pointer">
                 <input type="radio" value="Excel" {...register('format')} className="peer sr-only" />
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-all">
                    <FileSpreadsheet className="w-8 h-8 mb-2 text-slate-400 peer-checked:text-indigo-600" />
                    <span className="text-sm font-bold">Excel</span>
                 </div>
              </label>
              <label className="cursor-pointer">
                 <input type="radio" value="CSV" {...register('format')} className="peer sr-only" />
                 <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-all">
                    <FileJson className="w-8 h-8 mb-2 text-slate-400 peer-checked:text-indigo-600" />
                    <span className="text-sm font-bold">CSV</span>
                 </div>
              </label>
           </div>
           {errors.format && <p className="text-xs text-red-500">{errors.format.message}</p>}

           <div className="space-y-3 pt-4 border-t border-slate-100">
             <label className="flex items-center gap-3">
               <input type="checkbox" {...register('includeCharts')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
               <span className="text-sm font-medium text-slate-700">Include charts and graphs (PDF only)</span>
             </label>
             <label className="flex items-center gap-3">
               <input type="checkbox" {...register('includeRawData')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
               <span className="text-sm font-medium text-slate-700">Include raw data appendix</span>
             </label>
           </div>

           <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 <DownloadCloud className="w-4 h-4 mr-2" />
                 Start Export
              </Button>
           </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
