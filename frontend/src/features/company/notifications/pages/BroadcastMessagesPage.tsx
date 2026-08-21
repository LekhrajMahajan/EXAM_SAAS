import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { BroadcastDialog } from '../components/BroadcastDialog';
import { Button } from '@/shared/components/ui/button';
import { Send, History, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BroadcastMessagesPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Broadcast Messages" 
        description="Trigger manual notifications to specific user segments or centers." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
               <Send className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Compose a Broadcast</h3>
            <p className="text-sm text-slate-600 mb-6">Send an immediate or scheduled alert via Email, SMS, Push, or In-App to targeted audiences.</p>
            <BroadcastDialog 
               trigger={
                 <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                    Start Broadcast
                 </Button>
               }
            />
         </div>

         <div className="space-y-4">
            <Link to="/company/notifications/history" className="block p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-lg flex items-center justify-center text-slate-500 transition-colors">
                     <History className="w-5 h-5" />
                  </div>
               </div>
               <h4 className="font-bold text-slate-900">Broadcast History</h4>
               <p className="text-sm text-slate-500 mt-1">Review previously sent broadcasts and their delivery success rates.</p>
            </Link>

            <Link to="/company/notifications/scheduled" className="block p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-600 rounded-lg flex items-center justify-center text-slate-500 transition-colors">
                     <Clock className="w-5 h-5" />
                  </div>
               </div>
               <h4 className="font-bold text-slate-900">Scheduled Queue</h4>
               <p className="text-sm text-slate-500 mt-1">Manage broadcasts that are queued for future delivery.</p>
            </Link>
         </div>
      </div>
    </div>
  );
}
