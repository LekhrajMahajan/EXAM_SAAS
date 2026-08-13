import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { CandidateDocument } from '../types';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatusBadge } from './StatusBadge';

interface DocumentCardProps {
  document: CandidateDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{document.type}</h4>
            <p className="text-sm text-slate-500 mt-0.5">{document.name}</p>
            <div className="flex items-center gap-3 mt-2 sm:hidden">
               <StatusBadge status={document.status} className="text-xs py-0.5" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
           <div className="hidden sm:block">
             <StatusBadge status={document.status} />
           </div>
           
           <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="h-8">
               <Eye className="w-4 h-4 mr-2" />
               Preview
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
               <Download className="w-4 h-4" />
             </Button>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
