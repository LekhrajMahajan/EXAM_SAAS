import React from 'react';
import type { NotificationRecord } from '../types';
import { NotificationBadge } from './NotificationBadge';
import { Button } from '@/shared/components/ui/button';
import { Eye, RefreshCcw } from 'lucide-react';

interface HistoryTableProps {
  history: NotificationRecord[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">Delivery Time</th>
              <th scope="col" className="px-6 py-4">Message</th>
              <th scope="col" className="px-6 py-4">Channel</th>
              <th scope="col" className="px-6 py-4">Recipient</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                   {record.createdDate}
                </td>
                <td className="px-6 py-4 max-w-[200px] truncate font-medium text-slate-900">
                   {record.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                     {record.methods.map(m => <NotificationBadge key={m} type="method" value={m} />)}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700 truncate max-w-[150px]">
                   {record.audience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <NotificationBadge type="status" value={record.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500"><Eye className="w-4 h-4" /></Button>
                      {record.status === 'Failed' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50"><RefreshCcw className="w-4 h-4" /></Button>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
