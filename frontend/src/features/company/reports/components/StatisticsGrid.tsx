import React from 'react';
import type { ReportStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FileText, DownloadCloud, Clock, CheckCircle } from 'lucide-react';

interface StatisticsGridProps {
  stats: ReportStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <FileText className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.totalReports.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Reports Available</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.generatedReports.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Reports Generated</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <Clock className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.scheduledReports.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Active Scheduled Reports</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <DownloadCloud className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.downloadedReports.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Reports Downloaded</p>
        </CardContent>
      </Card>
    </div>
  );
}
