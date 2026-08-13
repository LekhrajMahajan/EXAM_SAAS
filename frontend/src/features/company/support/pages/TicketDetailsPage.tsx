import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TICKETS, DUMMY_COMMENTS, DUMMY_TIMELINE } from '../utils/placeholder';
import { CommentCard } from '../components/CommentCard';
import { TicketTimeline } from '../components/TicketTimeline';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { AssignmentDialog } from '../components/AssignmentDialog';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, User, Clock, Send, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { replySchema, type ReplyForm } from '../schemas/support-schemas';

export function TicketDetailsPage() {
  const { id } = useParams();
  const ticket = DUMMY_TICKETS.find(t => t.id === id) || DUMMY_TICKETS[1]; // Fallback for demo
  
  const { register, handleSubmit, watch, reset } = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      isInternal: false
    }
  });

  const isInternal = watch('isInternal');

  const onSubmit = (data: ReplyForm) => {
    console.log("Reply Submitted:", data);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
         <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-indigo-600">
            <Link to="/company/support/tickets"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Tickets</Link>
         </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{ticket.subject}</h1>
              <span className="text-xs font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{ticket.ticketNumber}</span>
           </div>
           <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {ticket.raisedBy.name}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Created: {new Date(ticket.createdDate).toLocaleString()}</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <AssignmentDialog trigger={<Button variant="outline">Assign Ticket</Button>} />
           <Button variant="outline" className={ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
              Mark as Resolved
           </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column: Conversation */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Description</h3>
               <p className="text-sm text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-lg text-slate-900">Conversation</h3>
               {DUMMY_COMMENTS.map(comment => (
                 <CommentCard key={comment.id} comment={comment} />
               ))}
            </div>

            {/* Reply Box */}
            <div className={`p-4 rounded-lg border shadow-sm ${isInternal ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-slate-200'}`}>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="flex justify-between items-center">
                     <h4 className="font-bold text-sm text-slate-900">Add a Reply</h4>
                     <label className="flex items-center gap-1.5 text-xs font-bold text-amber-600 cursor-pointer">
                        <input type="checkbox" {...register('isInternal')} className="w-3.5 h-3.5 text-amber-600 rounded border-slate-300" />
                        <Lock className="w-3.5 h-3.5" /> Internal Note
                     </label>
                  </div>
                  <textarea 
                    {...register('content')} 
                    className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 resize-y"
                    placeholder={isInternal ? "Write an internal note (only visible to staff)..." : "Write a reply to the user..."}
                  />
                  <div className="flex justify-end">
                     <Button type="submit" className={isInternal ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}>
                        <Send className="w-4 h-4 mr-2" /> {isInternal ? 'Add Internal Note' : 'Send Reply'}
                     </Button>
                  </div>
               </form>
            </div>
         </div>

         {/* Right Column: Metadata & Timeline */}
         <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Ticket Details</h3>
               <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                     <dt className="text-slate-500 font-medium">Status</dt>
                     <dd><StatusBadge status={ticket.status} /></dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-slate-500 font-medium">Priority</dt>
                     <dd><PriorityBadge priority={ticket.priority} /></dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-slate-500 font-medium">Category</dt>
                     <dd className="font-medium text-slate-900">{ticket.category}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-slate-500 font-medium">Assigned To</dt>
                     <dd className="font-medium text-slate-900">{ticket.assignedTo ? ticket.assignedTo.name : <span className="text-slate-400 italic">Unassigned</span>}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-slate-500 font-medium">Related Module</dt>
                     <dd className="font-medium text-slate-900">{ticket.relatedModule || 'N/A'}</dd>
                  </div>
               </dl>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Timeline</h3>
               <TicketTimeline events={DUMMY_TIMELINE} />
            </div>
         </div>
      </div>
    </div>
  );
}
