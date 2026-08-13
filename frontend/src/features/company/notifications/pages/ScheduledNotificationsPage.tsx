import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationTable } from '../components/NotificationTable';
import { Clock } from 'lucide-react';

export function ScheduledNotificationsPage() {
  const scheduledNotifs = DUMMY_NOTIFICATIONS.filter(n => n.status === 'Scheduled');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
         <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
         </div>
         <PageHeader 
           title="Scheduled Notifications" 
           description="Review, edit, or cancel broadcasts queued for future delivery." 
         />
      </div>
      
      {scheduledNotifs.length > 0 ? (
         <NotificationTable notifications={scheduledNotifs} />
      ) : (
         <div className="text-center p-12 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
            No notifications are currently scheduled.
         </div>
      )}
    </div>
  );
}
