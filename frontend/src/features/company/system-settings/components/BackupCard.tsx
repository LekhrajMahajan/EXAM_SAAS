import React from 'react';
import type { BackupRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { DatabaseBackup, Download, History, RotateCcw } from 'lucide-react';

interface BackupCardProps {
  history: BackupRecord[];
}

export function BackupCard({ history }: BackupCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
         <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2"><DatabaseBackup className="w-5 h-5 text-indigo-500" /> Database Backups</span>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
               Run Manual Backup
            </Button>
         </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left text-slate-600">
             <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
               <tr>
                 <th scope="col" className="px-6 py-4">Timestamp</th>
                 <th scope="col" className="px-6 py-4">Type</th>
                 <th scope="col" className="px-6 py-4">Size</th>
                 <th scope="col" className="px-6 py-4">Status</th>
                 <th scope="col" className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody>
               {history.map((record) => (
                 <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                   <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 flex items-center gap-2">
                      <History className="w-4 h-4 text-slate-400" /> {record.timestamp}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     {record.type}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                     {record.size}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${record.status === 'Completed' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                        {record.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="bg-white text-indigo-600 hover:bg-indigo-50" disabled={record.status !== 'Completed'}>
                          <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-amber-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200" disabled={record.status !== 'Completed'}>
                          <RotateCcw className="w-4 h-4 mr-2" /> Restore
                        </Button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </CardContent>
    </Card>
  );
}
