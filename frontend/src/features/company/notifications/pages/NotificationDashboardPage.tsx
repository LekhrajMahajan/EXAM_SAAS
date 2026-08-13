import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_NOTIF_STATS, DUMMY_NOTIFICATIONS, DUMMY_ANNOUNCEMENTS } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { NotificationCard } from '../components/NotificationCard';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Send } from 'lucide-react';
import { BroadcastDialog } from '../components/BroadcastDialog';
import { Link } from 'react-router-dom';

export function NotificationDashboardPage() {
  const recentNotifications = DUMMY_NOTIFICATIONS.slice(0, 3);
  const activeAnnouncements = DUMMY_ANNOUNCEMENTS.filter(a => a.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader 
          title="Notification Center" 
          description="Overview of all communication channels, delivery stats, and recent broadcasts." 
        />
        <BroadcastDialog 
           trigger={
             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send className="w-4 h-4 mr-2" /> New Broadcast
             </Button>
           } 
        />
      </div>

      <StatisticsGrid stats={DUMMY_NOTIF_STATS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Broadcasts Feed */}
         <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-end mb-4">
               <h3 className="text-lg font-bold text-slate-900">Recent Broadcasts</h3>
               <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
                  <Link to="/company/notifications/history">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
               </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {recentNotifications.map(notif => (
                 <NotificationCard key={notif.id} notification={notif} />
               ))}
            </div>
         </div>

         {/* Active Announcements */}
         <div className="space-y-4">
            <div className="flex justify-between items-end mb-4">
               <h3 className="text-lg font-bold text-slate-900">Active Announcements</h3>
               <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
                  <Link to="/company/notifications/announcements">Manage <ArrowRight className="w-4 h-4 ml-1" /></Link>
               </Button>
            </div>
            <div className="space-y-4">
               {activeAnnouncements.map(ann => (
                 <AnnouncementCard key={ann.id} announcement={ann} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
