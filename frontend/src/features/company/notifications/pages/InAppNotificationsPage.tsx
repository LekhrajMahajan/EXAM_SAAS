import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationTable } from '../components/NotificationTable';
import { LayoutDashboard } from 'lucide-react';

export function InAppNotificationsPage() {
  const inAppNotifs = DUMMY_NOTIFICATIONS.filter(n => n.methods.includes('In-App'));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <LayoutDashboard className="w-6 h-6" />
         </div>
         <PageHeader 
           title="In-App Notifications" 
           description="Alerts and messages displayed within the web platform." 
         />
      </div>
      
      <NotificationTable notifications={inAppNotifs} />
    </div>
  );
}
