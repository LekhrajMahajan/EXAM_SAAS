import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ACTIVITY } from '../utils/placeholder';
import { ActivityTable } from '../components/ActivityTable';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="File Activity Logs"
        description="A complete audit trail of all file operations across the platform."
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 w-full" placeholder="Search by file name or user..." />
        </div>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Actions</option>
          <option value="Upload">Upload</option>
          <option value="Download">Download</option>
          <option value="Delete">Delete</option>
          <option value="Archive">Archive</option>
          <option value="Share">Share</option>
        </select>
      </div>

      <ActivityTable activities={DUMMY_ACTIVITY} />
    </div>
  );
}
