import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Clock, PlusCircle, PauseCircle, PlayCircle, Edit } from 'lucide-react';
import { DUMMY_SCHEDULED_REPORTS } from '../utils/placeholder';
import { ScheduleDialog } from '../components/ScheduleDialog';

export function ScheduledReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Scheduled Reports" 
          description="Manage automated recurring report generation and delivery." 
        />
        <ScheduleDialog 
           trigger={
             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
               <PlusCircle className="w-4 h-4 mr-2" /> Create Schedule
             </Button>
           }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {DUMMY_SCHEDULED_REPORTS.map((schedule) => (
           <Card key={schedule.id} className={`border-slate-200 shadow-sm ${schedule.status === 'Paused' ? 'opacity-70 grayscale' : ''}`}>
             <CardContent className="p-5">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {schedule.category}
                   </span>
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${schedule.status === 'Active' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                    {schedule.status}
                 </span>
               </div>
               
               <h4 className="font-bold text-slate-900 mb-1">{schedule.reportName}</h4>
               
               <div className="space-y-2 mt-4 text-sm">
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500">Frequency</span>
                   <span className="font-medium text-slate-900">{schedule.frequency}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500">Format</span>
                   <span className="font-medium text-slate-900">{schedule.format}</span>
                 </div>
                 <div className="flex justify-between pb-2">
                   <span className="text-slate-500">Next Run</span>
                   <span className="font-medium text-indigo-600 flex items-center gap-1"><Clock className="w-3 h-3"/> {schedule.nextRun}</span>
                 </div>
               </div>

               <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" className="flex-1 bg-white">
                    {schedule.status === 'Active' ? <><PauseCircle className="w-4 h-4 mr-2 text-amber-600" /> Pause</> : <><PlayCircle className="w-4 h-4 mr-2 text-emerald-600" /> Resume</>}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white px-3">
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Button>
               </div>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  );
}
