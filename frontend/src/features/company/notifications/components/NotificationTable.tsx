import React from 'react';
import type { NotificationRecord } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, Eye } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { Input } from '@/shared/components/ui/input';

interface NotificationTableProps {
  notifications: NotificationRecord[];
}

export function NotificationTable({ notifications }: NotificationTableProps) {
  
  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search notifications by title or audience..." />
         </div>
         <Button variant="outline" className="bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Filters
         </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4">Title & Description</th>
                <th scope="col" className="px-6 py-4">Priority</th>
                <th scope="col" className="px-6 py-4">Audience</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Created By</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 max-w-xs">
                     <div className="font-semibold text-slate-900 mb-1">{notif.title}</div>
                     <div className="text-xs text-slate-500 truncate">{notif.description}</div>
                     <div className="flex gap-1 mt-2">
                        {notif.methods.map(m => <NotificationBadge key={m} type="method" value={m} />)}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <NotificationBadge type="priority" value={notif.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {notif.audience}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <NotificationBadge type="status" value={notif.status} />
                     {notif.scheduledFor && <div className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">{notif.scheduledFor}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="font-medium text-slate-700">{notif.createdBy}</div>
                    {notif.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" className="text-slate-500">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
