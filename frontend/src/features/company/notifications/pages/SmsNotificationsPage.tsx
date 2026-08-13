import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationTable } from '../components/NotificationTable';
import { Smartphone } from 'lucide-react';

export function SmsNotificationsPage() {
  const smsNotifs = DUMMY_NOTIFICATIONS.filter(n => n.methods.includes('SMS'));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
         <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Smartphone className="w-6 h-6" />
         </div>
         <PageHeader 
           title="SMS Notifications" 
           description="Log of text messages sent via the SMS Gateway (OTPs, urgent alerts)." 
         />
      </div>
      
      <NotificationTable notifications={smsNotifs} />
    </div>
  );
}
