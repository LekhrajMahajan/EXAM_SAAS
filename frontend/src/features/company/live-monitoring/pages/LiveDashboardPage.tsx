import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { CenterStatusCard } from '../components/CenterStatusCard';
import { ViolationTable } from '../components/ViolationTable';
import { DUMMY_MONITORING_STATS, DUMMY_LIVE_CENTERS, DUMMY_VIOLATIONS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export function LiveDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Live Monitoring Dashboard" 
          description="Real-time overview of active exams, candidates, and potential violations." 
        />
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
             Live Data Feed Active
           </div>
           <Button variant="outline" size="icon" className="bg-white">
             <RefreshCw className="w-4 h-4 text-slate-600" />
           </Button>
        </div>
      </div>

      <StatisticsGrid stats={DUMMY_MONITORING_STATS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Recent Violations
            </h3>
            <Button variant="link" asChild className="text-indigo-600 p-0">
              <Link to="/company/live-monitoring/violations">View All</Link>
            </Button>
          </div>
          <ViolationTable violations={DUMMY_VIOLATIONS} />
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Center Health</h3>
            <Button variant="link" asChild className="text-indigo-600 p-0">
              <Link to="/company/live-monitoring/centers">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {DUMMY_LIVE_CENTERS.slice(0, 3).map((center) => (
              <CenterStatusCard key={center.id} center={center} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
