import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { DUMMY_MERIT_STATS } from '../utils/placeholder';

export function MeritAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Merit List Analytics" 
        description="Analyze ranking distribution across states, categories, and test centers." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard title="Category-wise Distribution" description="Percentage of candidates making the merit list per category.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Donut/Pie)</p>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {Object.entries(DUMMY_MERIT_STATS.categoryMeritCount).map(([category, count]) => (
                 <div key={category} className="text-center bg-white border border-slate-100 p-2 rounded">
                    <p className="text-xs text-slate-500">{category}</p>
                    <p className="font-bold text-slate-800">{count}</p>
                 </div>
              ))}
           </div>
        </AnalyticsCard>
        
        <AnalyticsCard title="State-wise Ranking Density" description="Heatmap style visualization of top candidates by state.">
           <div className="h-full min-h-[256px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Geo/Map)</p>
           </div>
        </AnalyticsCard>

        <AnalyticsCard title="Score Cutoffs" description="Trend of cutoffs required to make the merit list.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Line Chart)</p>
           </div>
        </AnalyticsCard>

        <AnalyticsCard title="City/Center Performance" description="Top test centers by candidate rank outputs.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Horizontal Bar)</p>
           </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}
