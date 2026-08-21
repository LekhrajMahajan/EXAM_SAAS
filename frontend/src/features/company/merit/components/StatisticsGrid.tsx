import React from 'react';
import type { MeritStatistics } from '../types';
import { MasterAdminStatCard as StatCard } from '@/features/master-admin/components/cards/MasterAdminStatCard';
import { Trophy, FileText, CheckCircle, Clock, Users, Hash } from 'lucide-react';

interface StatisticsGridProps {
  stats: MeritStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Row 1 */}
      <StatCard 
        title="Total Merit Lists" 
        value={stats.totalMeritLists} 
        icon={FileText} 
        accent="slate" 
      />
      <StatCard 
        title="Published" 
        value={stats.publishedMeritLists} 
        icon={CheckCircle} 
        accent="green" 
      />
      <StatCard 
        title="Pending Publish" 
        value={stats.pendingMeritLists} 
        icon={Clock} 
        accent="amber" 
      />
      <StatCard 
        title="Candidates Ranked" 
        value={stats.candidatesRanked.toLocaleString()} 
        icon={Users} 
        accent="lime" 
      />

      {/* Row 2 - Categories (Summary view) */}
      {Object.entries(stats.categoryMeritCount).map(([category, count]) => (
        <StatCard
          key={category}
          title={`${category} Category`}
          value={(count as number).toLocaleString()}
          icon={Hash}
          accent="slate"
        />
      ))}
    </div>
  );
}
