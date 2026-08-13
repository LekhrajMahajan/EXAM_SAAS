import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { DUMMY_ACTIVITY_LOGS } from '../utils/placeholder';
import { Input } from '@/shared/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function ActivityLogsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="System Activity Logs" 
          description="Chronological audit trail of system events, authentication, and errors." 
        />
        <Button variant="outline" className="bg-white">
          <Calendar className="w-4 h-4 mr-2 text-slate-500" />
          Select Date Range
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search logs by keyword, candidate, or action..." 
            className="pl-9 bg-slate-50"
          />
        </div>
      </div>

      <ActivityTimeline logs={DUMMY_ACTIVITY_LOGS} />
    </div>
  );
}
