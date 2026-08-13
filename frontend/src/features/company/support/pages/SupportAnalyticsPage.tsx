import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SUPPORT_STATS } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export function SupportAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Support Analytics" 
        description="Monitor team performance, ticket trends, and SLA metrics." 
      />
      
      <StatisticsGrid stats={DUMMY_SUPPORT_STATS} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="font-bold text-slate-900 mb-1">Category Distribution</h3>
            <p className="text-sm text-slate-500">Analytics visualization placeholder</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="font-bold text-slate-900 mb-1">Resolution Time Trends</h3>
            <p className="text-sm text-slate-500">Analytics visualization placeholder</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center md:col-span-2">
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="font-bold text-slate-900 mb-1">Agent Performance Leaderboard</h3>
            <p className="text-sm text-slate-500">Analytics visualization placeholder</p>
         </div>
      </div>
    </div>
  );
}
