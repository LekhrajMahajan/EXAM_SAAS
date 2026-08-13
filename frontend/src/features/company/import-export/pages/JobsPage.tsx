import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_JOBS } from '../utils/placeholder';
import { JobTable } from '../components/JobTable';
import { ProgressCard } from '../components/ProgressCard';

export function JobsPage() {
  const activeJobs = DUMMY_JOBS.filter(j => j.status === 'Processing' || j.status === 'Pending');
  const completedJobs = DUMMY_JOBS.filter(j => j.status !== 'Processing' && j.status !== 'Pending');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Queue"
        description="Monitor active and queued import/export background jobs."
      />

      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Active & Pending <span className="text-slate-400 font-normal ml-1 text-sm">({activeJobs.length})</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map(job => <ProgressCard key={job.id} job={job} />)}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">All Jobs</h3>
        <JobTable jobs={DUMMY_JOBS} />
      </div>
    </div>
  );
}
