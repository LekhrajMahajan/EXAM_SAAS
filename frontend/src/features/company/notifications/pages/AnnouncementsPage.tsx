import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ANNOUNCEMENTS } from '../utils/placeholder';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader 
          title="Global Announcements" 
          description="Manage persistent banner announcements displayed across the platform." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <Plus className="w-4 h-4 mr-2" /> New Announcement
        </Button>
      </div>
      
      <div className="max-w-4xl space-y-4">
         {DUMMY_ANNOUNCEMENTS.map(ann => (
           <AnnouncementCard key={ann.id} announcement={ann} />
         ))}
      </div>
    </div>
  );
}
