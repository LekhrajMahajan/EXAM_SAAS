import React from 'react';
import type { NotificationTemplate } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Edit3, Copy, Trash2 } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';

export function TemplateCard({ template }: { template: NotificationTemplate }) {
  return (
    <Card className="border-slate-200 shadow-sm flex flex-col h-full">
      <CardContent className="p-5 flex-1 flex flex-col">
         <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-slate-900">{template.name}</h4>
            <NotificationBadge type="method" value={template.method} />
         </div>
         
         <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4 flex-1">
            {template.subject && <div className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-2 mb-2">Subject: {template.subject}</div>}
            <div className="text-xs text-slate-600 font-mono whitespace-pre-wrap">{template.bodyPreview}</div>
         </div>

         <div className="mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Available Variables:</span>
            <div className="flex flex-wrap gap-1">
               {template.variables.map(v => (
                  <span key={v} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px] font-mono">
                     {`{{${v}}}`}
                  </span>
               ))}
            </div>
         </div>

         <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
            <span className="text-[10px] text-slate-400">Updated {template.lastUpdated}</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"><Copy className="w-4 h-4" /></Button>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"><Edit3 className="w-4 h-4" /></Button>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
