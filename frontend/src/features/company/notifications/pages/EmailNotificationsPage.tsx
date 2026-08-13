import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationTable } from '../components/NotificationTable';
import { Mail } from 'lucide-react';

export function EmailNotificationsPage() {
  const emailNotifs = DUMMY_NOTIFICATIONS.filter(n => n.methods.includes('Email'));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
         <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
            <Mail className="w-6 h-6" />
         </div>
         <PageHeader 
           title="Email Notifications" 
           description="Log of all automated and broadcast emails sent to users." 
         />
      </div>
      
      <NotificationTable notifications={emailNotifs} />
    </div>
  );
}
