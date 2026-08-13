import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ERRORS, DUMMY_JOBS } from '../utils/placeholder';
import { ErrorTable } from '../components/ErrorTable';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ErrorReportsPage() {
  const failedJobs = DUMMY_JOBS.filter(j => j.errorRecords > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Error Reports"
        description="Review validation and processing errors from failed or partial import jobs."
      />

      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Jobs With Errors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {failedJobs.map(job => (
            <div key={job.id} className="flex items-center gap-4 p-4 bg-white border border-red-200 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate text-sm">{job.fileName}</div>
                <div className="text-[10px] font-bold text-red-600 uppercase mt-0.5">{job.errorRecords} Errors Found</div>
              </div>
              <Link
                to={`/company/import-export/errors?jobId=${job.id}`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Error Details</h3>
        <ErrorTable errors={DUMMY_ERRORS} />
      </div>
    </div>
  );
}
