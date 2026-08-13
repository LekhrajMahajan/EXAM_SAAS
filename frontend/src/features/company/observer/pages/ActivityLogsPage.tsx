import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ACTIVITY } from '../utils/placeholder';
import { ActivityTimeline } from '../components/ActivityTimeline';

export function ActivityLogsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Staff Activity Logs" description="Audit trail of observer and invigilator actions including check-ins, reports, and logins." />
      </div>

      <div className="flex gap-3 mb-6">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 flex-1">
          <option>All Activity Types</option>
          <option>Login</option>
          <option>Duty Events</option>
          <option>Incidents & Violations</option>
        </select>
        <input type="date" className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" />
      </div>

      <ActivityTimeline logs={DUMMY_ACTIVITY} />
    </div>
  );
}
