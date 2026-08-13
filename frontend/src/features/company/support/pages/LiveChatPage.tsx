import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { MessageSquareText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function LiveChatPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Live Chat Support" 
        description="Provide real-time assistance to candidates and staff." 
      />
      
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl text-center h-[500px]">
         <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <MessageSquareText className="w-8 h-8" />
         </div>
         <h2 className="text-xl font-bold text-slate-900 mb-2">Live Chat is Offline</h2>
         <p className="text-slate-500 max-w-md mb-6">Real-time WebSocket chat integration is not currently active. Connect a live chat provider to handle active sessions.</p>
         <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Configure Chat Provider</Button>
      </div>
    </div>
  );
}
