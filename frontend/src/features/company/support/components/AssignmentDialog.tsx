import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema, type AssignmentForm } from '../schemas/support-schemas';
import { Users, User } from 'lucide-react';

export function AssignmentDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      assigneeType: 'User'
    }
  });

  const type = watch('assigneeType');

  const onSubmit = (data: AssignmentForm) => {
    console.log("Assigned:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Ticket</DialogTitle>
          <DialogDescription>Transfer this ticket to a specific agent or a support team.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
           
           <div className="flex gap-4 mb-2">
              <label className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 flex-1 transition-colors">
                 <input type="radio" value="User" {...register('assigneeType')} className="sr-only" />
                 <User className="w-5 h-5 mb-1 text-slate-500" />
                 <span className="font-bold text-sm">Specific Agent</span>
              </label>
              <label className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 flex-1 transition-colors">
                 <input type="radio" value="Team" {...register('assigneeType')} className="sr-only" />
                 <Users className="w-5 h-5 mb-1 text-slate-500" />
                 <span className="font-bold text-sm">Support Team</span>
              </label>
           </div>

           <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Select {type}</label>
              <select {...register('assigneeId')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                 <option value="">-- Choose --</option>
                 {type === 'User' ? (
                   <>
                     <option value="U1">Agent Bob</option>
                     <option value="U2">Agent Alice</option>
                   </>
                 ) : (
                   <>
                     <option value="T1">L1 Support</option>
                     <option value="T2">L2 Support</option>
                     <option value="T3">Billing</option>
                   </>
                 )}
              </select>
              {errors.assigneeId && <p className="text-[10px] text-red-500">{errors.assigneeId.message}</p>}
           </div>

           <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Internal Transfer Note <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea 
                {...register('internalNote')} 
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-none"
                placeholder="Why are you transferring this?"
              />
           </div>

           <DialogFooter className="pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 Confirm Assignment
              </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
