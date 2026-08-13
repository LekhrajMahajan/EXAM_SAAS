import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FILE_STATS, DUMMY_FILES, DUMMY_ACTIVITY } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { FileTable } from '../components/FileTable';
import { ActivityTable } from '../components/ActivityTable';
import { StorageCard } from '../components/StorageCard';
import { Button } from '@/shared/components/ui/button';
import { Upload, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FileDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="File & Document Management"
          description="Manage all platform documents, media, and storage across modules."
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
          <Link to="/company/file-management/upload"><Upload className="w-4 h-4 mr-2" /> Upload Files</Link>
        </Button>
      </div>

      <StatisticsGrid stats={DUMMY_FILE_STATS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-base font-bold text-slate-900">Recent Uploads</h3>
            <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
              <Link to="/company/file-management/library">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <FileTable files={DUMMY_FILES.slice(0, 5)} />
        </div>

        <div className="space-y-6">
          <StorageCard />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
            <Link to="/company/file-management/activity">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        <ActivityTable activities={DUMMY_ACTIVITY} />
      </div>
    </div>
  );
}
