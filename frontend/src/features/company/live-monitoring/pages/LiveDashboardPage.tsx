import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { CenterStatusCard } from '../components/CenterStatusCard';
import { ViolationTable } from '../components/ViolationTable';
import { useLiveCenters } from '../hooks/useLiveCenters';
import { useViolations } from '../hooks/useViolations';
import type { MonitoringStats } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export function LiveDashboardPage() {
  const { data: centersData } = useLiveCenters();
  const { data: violationsData } = useViolations();

  const liveCenters = centersData?.data || [];
  const violations = violationsData?.data || [];

  const stats: MonitoringStats = {
    activeExams: 3, // Assuming 3 active exams 
    activeCandidates: liveCenters.reduce((acc: number, c: any) => acc + c.activeCandidates, 0),
    completedCandidates: liveCenters.reduce((acc: number, c: any) => acc + c.completedCandidates, 0),
    disconnectedCandidates: 15, // Assuming 15 disconnected candidates globally
    violations: violations.length,
    onlineCenters: liveCenters.filter((c: any) => c.status === 'Online').length,
    offlineCenters: liveCenters.filter((c: any) => c.status === 'Offline').length,
    observersOnline: 48
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Live Monitoring Dashboard" 
          description="Real-time overview of active exams, candidates, and potential violations." 
        />
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(228,253,151,0.8)] animate-pulse"></span>
             Live Data Feed Active
           </div>
           <Button variant="outline" size="icon" className="bg-card">
             <RefreshCw className="w-4 h-4 text-muted-foreground" />
           </Button>
        </div>
      </div>

      <StatisticsGrid stats={stats} />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Recent Violations
            </h3>
            <Button variant="link" asChild className="text-primary p-0">
              <Link to="/company/live-monitoring/violations">View All</Link>
            </Button>
          </div>
          <ViolationTable violations={violations.slice(0, 5)} />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Center Health</h3>
            <Button variant="link" asChild className="text-primary p-0">
              <Link to="/company/live-monitoring/centers">View All</Link>
            </Button>
          </div>
          {liveCenters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveCenters.slice(0, 3).map((center: any) => (
                <CenterStatusCard key={center.id} center={center} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-card border border-border border-dashed rounded-xl flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <ShieldCheck className="w-6 h-6 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground font-medium">No active centers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
