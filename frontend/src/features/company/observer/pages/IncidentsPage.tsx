import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_INCIDENTS } from '../utils/placeholder';
import { IncidentTable } from '../components/IncidentTable';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function IncidentsPage() {
  const [status, setStatus] = useState('');

  const filtered = status
    ? DUMMY_INCIDENTS.filter(i => i.status === status)
    : DUMMY_INCIDENTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Incident Reports" description="Manage and track issues raised by observers and invigilators during exams." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Report Incident
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'Open', 'Investigating', 'Resolved', 'Closed'].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
          >
            {s === '' ? 'All Statuses' : s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Categories</option>
          <option>Technical Issue</option>
          <option>Medical Emergency</option>
          <option>Logistics</option>
          <option>Security</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Severities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>

      <IncidentTable incidents={filtered} />
    </div>
  );
}
