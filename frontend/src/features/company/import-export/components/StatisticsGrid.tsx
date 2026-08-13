import React from 'react';
import type { ImportExportStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Upload, Download, CheckCircle, XCircle, Clock, CheckSquare } from 'lucide-react';

interface StatisticsGridProps {
  stats: ImportExportStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Upload className="w-5 h-5 text-indigo-500 mb-2" />
          <p className="text-xl font-bold text-slate-900">{stats.totalImports}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Total Imports</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Download className="w-5 h-5 text-indigo-500 mb-2" />
          <p className="text-xl font-bold text-slate-900">{stats.totalExports}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Total Exports</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-xl font-bold text-slate-900">{stats.successfulImports}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Successful</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <XCircle className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-xl font-bold text-slate-900">{stats.failedImports}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Failed</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Clock className="w-5 h-5 text-amber-500 mb-2" />
          <p className="text-xl font-bold text-slate-900">{stats.pendingJobs}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Pending Jobs</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <CheckSquare className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{stats.completedJobs}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Completed</p>
        </CardContent>
      </Card>
    </div>
  );
}
