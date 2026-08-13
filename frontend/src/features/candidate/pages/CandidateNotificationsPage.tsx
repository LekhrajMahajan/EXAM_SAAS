import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationCard } from '../components/NotificationCard';
import { Button } from '@/shared/components/ui/button';

export function CandidateNotificationsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Notifications" 
          description="Stay updated with alerts and messages." 
        />
        <Button variant="outline" className="bg-white">Mark All as Read</Button>
      </div>

      <div className="grid gap-4">
        {DUMMY_NOTIFICATIONS.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
        {DUMMY_NOTIFICATIONS.length === 0 && (
           <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
              <p className="text-slate-500">You have no new notifications.</p>
           </div>
        )}
      </div>
    </div>
  );
}
