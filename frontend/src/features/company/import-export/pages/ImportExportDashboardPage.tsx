import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_STATS, DUMMY_JOBS } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { ProgressCard } from '../components/ProgressCard';
import { HistoryTable } from '../components/HistoryTable';
import { Button } from '@/shared/components/ui/button';
import { Upload, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ImportExportDashboardPage() {
  const activeJobs = DUMMY_JOBS.filter(j => j.status === 'Processing');
  const recentHistory = DUMMY_JOBS.filter(j => j.status !== 'Processing' && j.status !== 'Pending').slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="Import & Export Management"
          description="Manage bulk data operations, monitor active jobs, and review history."
        />
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/company/import-export/export"><Download className="w-4 h-4 mr-2" /> Export Data</Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link to="/company/import-export/import"><Upload className="w-4 h-4 mr-2" /> Import Data</Link>
          </Button>
        </div>
      </div>

      <StatisticsGrid stats={DUMMY_STATS} />

      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Active Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map(job => <ProgressCard key={job.id} job={job} />)}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
            <Link to="/company/import-export/history">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        <HistoryTable jobs={recentHistory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/company/import-export/templates" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-colors group">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Download className="w-5 h-5" /></div>
          <div><div className="font-bold text-slate-900 group-hover:text-indigo-600">Download Templates</div><div className="text-xs text-slate-500 mt-1">Get CSV/Excel starter files</div></div>
        </Link>
        <Link to="/company/import-export/errors" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-red-300 shadow-sm transition-colors group">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"><Upload className="w-5 h-5" /></div>
          <div><div className="font-bold text-slate-900 group-hover:text-red-600">Error Reports</div><div className="text-xs text-slate-500 mt-1">Review failed job errors</div></div>
        </Link>
        <Link to="/company/import-export/mapping" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-colors group">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><ArrowRight className="w-5 h-5" /></div>
          <div><div className="font-bold text-slate-900 group-hover:text-indigo-600">Field Mapping</div><div className="text-xs text-slate-500 mt-1">Configure data mappings</div></div>
        </Link>
      </div>
    </div>
  );
}
