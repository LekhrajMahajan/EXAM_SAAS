import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { MeritStatistics } from '../types';
import { Trophy, FileText, CheckCircle, Clock, Users, Hash } from 'lucide-react';

interface StatisticsGridProps {
  stats: MeritStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Row 1 */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Merit Lists</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalMeritLists}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Published</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.publishedMeritLists}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Publish</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingMeritLists}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Candidates Ranked</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.candidatesRanked.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
        </CardContent>
      </Card>

      {/* Row 2 - Categories (Summary view) */}
      {Object.entries(stats.categoryMeritCount).map(([category, count]) => (
        <Card key={category} className="border-slate-200 shadow-sm">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{category} Category</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{count.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <Hash className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
