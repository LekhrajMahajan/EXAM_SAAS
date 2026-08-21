import React from 'react';
import { Users, ServerOff, AlertTriangle, MonitorPlay } from 'lucide-react';
import type { MonitoringStats } from '../types';
import { MasterAdminStatCard as StatCard } from '@/features/master-admin/components/cards/MasterAdminStatCard';

interface StatisticsGridProps {
  stats: MonitoringStats;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Active Exams" 
        value={stats.activeExams} 
        icon={MonitorPlay} 
        accent="slate" 
      />
      <StatCard 
        title="Live Candidates" 
        value={stats.activeCandidates} 
        description={`${stats.completedCandidates} Completed`}
        icon={Users} 
        accent="green" 
      />
      <StatCard 
        title="Violations" 
        value={stats.violations} 
        icon={AlertTriangle} 
        accent="amber" 
      />
      <StatCard 
        title="Disconnected" 
        value={stats.disconnectedCandidates} 
        icon={ServerOff} 
        accent="red" 
      />
    </div>
  );
}
