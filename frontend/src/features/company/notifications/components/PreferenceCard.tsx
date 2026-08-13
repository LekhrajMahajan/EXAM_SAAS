import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Bell, Mail, Smartphone, LayoutDashboard } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { PreferenceForm } from '../schemas/notification-schemas';

export function PreferenceCard() {
  const { register } = useFormContext<PreferenceForm>();

  return (
    <Card className="border-slate-200 shadow-sm max-w-2xl">
      <CardContent className="p-0">
         <div className="divide-y divide-slate-100">
            
            <label className="flex items-center justify-between p-5 hover:bg-slate-50 cursor-pointer transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                     <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900">System Announcements</h4>
                     <p className="text-sm text-slate-500">Updates about platform features, downtime, and policies.</p>
                  </div>
               </div>
               <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" {...register('systemAnnouncements')} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
               </div>
            </label>

            <label className="flex items-center justify-between p-5 hover:bg-slate-50 cursor-pointer transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <Bell className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900">Exam Alerts</h4>
                     <p className="text-sm text-slate-500">Notifications regarding upcoming exams, admit cards, and center changes.</p>
                  </div>
               </div>
               <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" {...register('examAlerts')} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
               </div>
            </label>

            <label className="flex items-center justify-between p-5 hover:bg-slate-50 cursor-pointer transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                     <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900">Result Updates</h4>
                     <p className="text-sm text-slate-500">Get notified immediately when your exam results or merit lists are published.</p>
                  </div>
               </div>
               <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" {...register('resultUpdates')} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
               </div>
            </label>

            <label className="flex items-center justify-between p-5 hover:bg-slate-50 cursor-pointer transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                     <Mail className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900">Marketing & Offers</h4>
                     <p className="text-sm text-slate-500">Promotional emails regarding discount codes, new test series, and partners.</p>
                  </div>
               </div>
               <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" {...register('marketingEmails')} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
               </div>
            </label>

         </div>
      </CardContent>
    </Card>
  );
}
