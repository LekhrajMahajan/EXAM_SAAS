import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { broadcastSchema, type BroadcastForm } from '../schemas/notification-schemas';
import { Send, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function BroadcastDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BroadcastForm>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      priority: 'Normal',
      category: 'System',
      targetAudience: 'All',
      scheduleType: 'Immediate',
      methods: ['In-App']
    }
  });

  const scheduleType = watch('scheduleType');
  const targetAudience = watch('targetAudience');

  const onSubmit = (data: BroadcastForm) => {
    console.log("Broadcast Submitted: ", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-indigo-500" /> New Broadcast Message</DialogTitle>
          <DialogDescription>Send a mass notification across multiple channels simultaneously.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
           {/* Message Content */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">1. Message Content</h4>
              <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Message Title</label>
                 <Input {...register('title')} placeholder="e.g., Server Maintenance Notice" />
                 {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Message Body</label>
                 <textarea 
                   {...register('message')} 
                   className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                   placeholder="Type your message here..."
                 />
                 {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select {...register('category')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                       <option value="System">System</option>
                       <option value="Exam">Exam</option>
                       <option value="Result">Result</option>
                       <option value="Marketing">Marketing</option>
                       <option value="Alert">Alert</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Priority</label>
                    <select {...register('priority')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                       <option value="Low">Low</option>
                       <option value="Normal">Normal</option>
                       <option value="High">High</option>
                       <option value="Urgent">Urgent</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Delivery Channels */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">2. Delivery Channels</h4>
              <div className="flex gap-4">
                 {['In-App', 'Email', 'SMS', 'Push'].map(method => (
                   <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" value={method} {...register('methods')} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                      <span className="text-sm font-medium text-slate-700">{method}</span>
                   </label>
                 ))}
              </div>
              {errors.methods && <p className="text-xs text-red-500">{errors.methods.message}</p>}
           </div>

           {/* Audience */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">3. Audience Targeting</h4>
              <div className="space-y-1.5">
                 <select {...register('targetAudience')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                    <option value="All">All Users</option>
                    <option value="Specific Roles">Specific Roles</option>
                    <option value="Specific Centers">Specific Centers</option>
                 </select>
              </div>
              
              {targetAudience === 'Specific Roles' && (
                 <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Role selection dropdown placeholder
                 </div>
              )}

           </div>

           {/* Scheduling */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">4. Scheduling</h4>
              <div className="flex gap-6 mb-3">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Immediate" {...register('scheduleType')} className="w-4 h-4 text-indigo-600 border-slate-300" />
                    <span className="text-sm font-medium text-slate-700">Send Immediately</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Scheduled" {...register('scheduleType')} className="w-4 h-4 text-indigo-600 border-slate-300" />
                    <span className="text-sm font-medium text-slate-700">Schedule for Later</span>
                 </label>
              </div>

              {scheduleType === 'Scheduled' && (
                 <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-md border border-indigo-100">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">Date</label>
                       <Input type="date" {...register('scheduledDate')} />
                       {errors.scheduledDate && <p className="text-xs text-red-500">{errors.scheduledDate.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">Time</label>
                       <Input type="time" {...register('scheduledTime')} />
                    </div>
                 </div>
              )}
           </div>

           <DialogFooter className="pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 {scheduleType === 'Immediate' ? <><Send className="w-4 h-4 mr-2" /> Broadcast Now</> : <><Clock className="w-4 h-4 mr-2" /> Schedule Broadcast</>}
              </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
