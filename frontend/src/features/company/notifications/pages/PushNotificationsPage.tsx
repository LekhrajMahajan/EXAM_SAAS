import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationTable } from '../components/NotificationTable';
import { Bell } from 'lucide-react';

export function PushNotificationsPage() {
  const pushNotifs = DUMMY_NOTIFICATIONS.filter(n => n.methods.includes('Push'));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
         <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <Bell className="w-6 h-6" />
         </div>
         <PageHeader 
           title="Push Notifications" 
           description="Mobile app and browser push notification delivery logs." 
         />
      </div>
      
      <NotificationTable notifications={pushNotifs} />
    </div>
  );
}
