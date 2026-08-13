import React from 'react';
import type { Announcement } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Megaphone, CalendarDays } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <Card className="border-slate-200 shadow-sm relative overflow-hidden">
      {!announcement.isActive && (
         <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm">Inactive</span>
         </div>
      )}
      <CardContent className="p-5">
         <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${announcement.priority === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
               <Megaphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-slate-900 text-lg">{announcement.title}</h3>
               <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium mb-3">
                  <span className="flex items-center"><CalendarDays className="w-3 h-3 mr-1" /> Published: {announcement.publishDate}</span>
                  {announcement.expiryDate && <span className="flex items-center text-amber-600"><CalendarDays className="w-3 h-3 mr-1" /> Expires: {announcement.expiryDate}</span>}
               </div>
               <p className="text-sm text-slate-600">{announcement.content}</p>
            </div>
         </div>
         <div className="flex justify-end mt-4 pt-4 border-t border-slate-100 gap-2 relative z-20">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="outline" size="sm" className={announcement.isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}>
               {announcement.isActive ? 'Deactivate' : 'Activate'}
            </Button>
         </div>
      </CardContent>
    </Card>
  );
}
