import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FileText, Download, Play, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { ReportRecord } from '../types';

interface ReportCardProps {
  report: ReportRecord;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
       <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-indigo-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {report.category}
             </span>
          </div>
          
          <h4 className="font-bold text-slate-900 mb-1">{report.name}</h4>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">{report.description}</p>
          
          <div className="flex items-center text-xs text-slate-400 mb-4 font-medium">
             <Clock className="w-3 h-3 mr-1" /> Last Run: {report.lastGenerated || 'Never'}
          </div>
          
          <div className="flex gap-2 border-t border-slate-100 pt-4">
             <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                <Play className="w-4 h-4 mr-2" /> Run
             </Button>
             <Button variant="outline" className="flex-1 bg-white border-slate-200" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export
             </Button>
          </div>
       </CardContent>
    </Card>
  );
}
