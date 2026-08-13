import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTicketSchema, type CreateTicketForm } from '../schemas/support-schemas';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Send, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'Low'
    }
  });

  const onSubmit = (data: CreateTicketForm) => {
    console.log("Ticket Created:", data);
    navigate('/company/support/tickets');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader 
        title="Create New Ticket" 
        description="Submit a new request on behalf of a user or for internal tracking." 
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Subject</label>
            <Input {...register('subject')} placeholder="Brief description of the issue" />
            {errors.subject && <p className="text-[10px] text-red-500">{errors.subject.message}</p>}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Category</label>
               <select {...register('category')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                  <option value="">-- Select Category --</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing">Billing</option>
                  <option value="Exam Rules">Exam Rules</option>
                  <option value="Account Access">Account Access</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
               </select>
               {errors.category && <p className="text-[10px] text-red-500">{errors.category.message}</p>}
            </div>
            
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Priority</label>
               <select {...register('priority')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
               </select>
            </div>
         </div>

         <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              {...register('description')} 
              className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-y"
              placeholder="Provide detailed information about the issue..."
            />
            {errors.description && <p className="text-[10px] text-red-500">{errors.description.message}</p>}
         </div>

         <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Attachments</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-indigo-300 transition-colors cursor-pointer">
               <Paperclip className="w-6 h-6 mb-2 text-slate-400" />
               <p className="text-sm">Click or drag files here to attach</p>
            </div>
         </div>

         <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/company/support/tickets')}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
               <Send className="w-4 h-4 mr-2" /> Submit Ticket
            </Button>
         </div>
      </form>
    </div>
  );
}
