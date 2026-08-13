import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ScoreCard } from '../components/ScoreCard';
import { DUMMY_RESULT_STATS } from '../utils/placeholder';
import { Trophy, Target, TrendingDown } from 'lucide-react';

export function ResultAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Result Analytics" 
        description="Deep dive into candidate performance and score distributions." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard 
          label="Highest Score" 
          value={`${DUMMY_RESULT_STATS.highestScore}%`}
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          trend="up"
        />
        <ScoreCard 
          label="Average Score" 
          value={`${DUMMY_RESULT_STATS.averageScore}%`}
          icon={<Target className="w-5 h-5 text-indigo-500" />}
          trend="neutral"
        />
        <ScoreCard 
          label="Lowest Score" 
          value={`${DUMMY_RESULT_STATS.lowestScore}%`}
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard title="Pass/Fail Distribution" description="Overall pass rate across all exams.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Donut/Pie)</p>
           </div>
        </AnalyticsCard>
        
        <AnalyticsCard title="Subject Wise Performance" description="Average scores segmented by subjects.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Bar Chart)</p>
           </div>
        </AnalyticsCard>

        <AnalyticsCard title="Grade Distribution" description="Frequency of grades awarded.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Histogram)</p>
           </div>
        </AnalyticsCard>

        <AnalyticsCard title="Center Wise Pass Percentage" description="Compare performance across test centers.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Horizontal Bar Chart)</p>
           </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}
