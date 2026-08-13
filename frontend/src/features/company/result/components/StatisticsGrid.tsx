import { Card, CardContent } from '@/shared/components/ui/card';
import type { ResultStatistics } from '../types';
import { FileText, CheckCircle, Clock, XCircle, TrendingUp, ArrowUpCircle, ArrowDownCircle, Percent } from 'lucide-react';

interface StatisticsGridProps {
  stats: ResultStatistics;
}

const getCardClasses = (accent: 'slate' | 'amber' | 'red') => {
  const base = "border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card";
  if (accent === 'amber') return `${base} border-amber-200 dark:border-amber-500/50`;
  if (accent === 'red') return `${base} border-red-200 dark:border-red-500/50`;
  return `${base} border-slate-200 dark:border-slate-800`;
};

const getNumClasses = (accent: 'slate' | 'amber' | 'red') => {
  if (accent === 'amber') return "text-amber-600 dark:text-amber-400";
  if (accent === 'red') return "text-red-600 dark:text-red-400";
  return "text-slate-900 dark:text-slate-100";
};

const StatCard = ({ title, value, icon: Icon, accent = 'slate' }: { title: string, value: string | number, icon: React.ElementType, accent?: 'slate' | 'amber' | 'red' }) => (
  <Card className={getCardClasses(accent)}>
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 line-clamp-2 leading-tight">
            {title}
          </p>
          <div className={`text-2xl font-bold mt-1 ${getNumClasses(accent)}`}>
            {value}
          </div>
        </div>
        <div className="p-1.5 rounded-md bg-[#E4FD97] text-[#2D3E2C] shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function StatisticsGrid({ stats }: StatisticsGridProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Row 1 */}
      <StatCard 
        title="Total Results" 
        value={stats.totalResults.toLocaleString()} 
        icon={FileText} 
        accent="slate" 
      />
      <StatCard 
        title="Published" 
        value={stats.publishedResults.toLocaleString()} 
        icon={CheckCircle} 
        accent="slate" 
      />
      <StatCard 
        title="Pending" 
        value={stats.pendingResults.toLocaleString()} 
        icon={Clock} 
        accent="amber" 
      />
      <StatCard 
        title="Failed / Withheld" 
        value={stats.failedResults.toLocaleString()} 
        icon={XCircle} 
        accent="red" 
      />

      {/* Row 2 */}
      <StatCard 
        title="Average Score" 
        value={`${typeof stats.averageScore === 'number' && stats.averageScore % 1 !== 0 ? stats.averageScore.toFixed(2) : stats.averageScore}%`} 
        icon={TrendingUp} 
        accent="slate" 
      />
      <StatCard 
        title="Highest Score" 
        value={`${typeof stats.highestScore === 'number' && stats.highestScore % 1 !== 0 ? stats.highestScore.toFixed(2) : stats.highestScore}%`} 
        icon={ArrowUpCircle} 
        accent="slate" 
      />
      <StatCard 
        title="Lowest Score" 
        value={`${typeof stats.lowestScore === 'number' && stats.lowestScore % 1 !== 0 ? stats.lowestScore.toFixed(2) : stats.lowestScore}%`} 
        icon={ArrowDownCircle} 
        accent="slate" 
      />
      <StatCard 
        title="Pass Percentage" 
        value={`${typeof stats.passPercentage === 'number' && stats.passPercentage % 1 !== 0 ? stats.passPercentage.toFixed(2) : stats.passPercentage}%`} 
        icon={Percent} 
        accent="slate" 
      />
    </div>
  );
}
