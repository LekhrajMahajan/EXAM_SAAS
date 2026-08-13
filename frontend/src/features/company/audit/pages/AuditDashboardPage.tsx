import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_AUDIT_STATS, DUMMY_AUDIT_LOGS, DUMMY_SECURITY_EVENTS, DUMMY_TIMELINE } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { AuditTable } from '../components/AuditTable';
import { TimelineCard } from '../components/TimelineCard';
import { ActivityCard } from '../components/ActivityCard';
import { SecurityEventCard } from '../components/SecurityEventCard';
import { FilterPanel } from '../components/FilterPanel';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuditDashboardPage() {
  const recentLogs = DUMMY_AUDIT_LOGS.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs & Activity" 
        description="Comprehensive monitoring of system access, configuration changes, and data mutations." 
      />

      <StatisticsGrid stats={DUMMY_AUDIT_STATS} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main View */}
         <div className="lg:col-span-2 space-y-6">
            <FilterPanel />
            
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-slate-900">Recent System Events</h3>
               </div>
               <AuditTable logs={recentLogs} />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-slate-900">Critical Security Alerts</h3>
                  <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
                     <Link to="/company/audit/security-events">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DUMMY_SECURITY_EVENTS.map(event => (
                    <SecurityEventCard key={event.id} event={event} />
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar View */}
         <div className="space-y-6">
            <ActivityCard />
            
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-slate-900">Today's Timeline</h3>
                  <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
                     <Link to="/company/audit/timeline">Full Timeline <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
               </div>
               <TimelineCard events={DUMMY_TIMELINE} />
            </div>
         </div>
      </div>
    </div>
  );
}
