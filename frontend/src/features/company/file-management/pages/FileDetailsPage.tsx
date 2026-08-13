import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FILES, DUMMY_ACTIVITY } from '../utils/placeholder';
import { PreviewPanel } from '../components/PreviewPanel';
import { ActivityTable } from '../components/ActivityTable';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Download, Archive, Share2 } from 'lucide-react';

export function FileDetailsPage() {
  const { id } = useParams();
  const file = DUMMY_FILES.find(f => f.id === id) ?? DUMMY_FILES[0];
  const fileActivity = DUMMY_ACTIVITY.filter(a => a.fileId === file.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-indigo-600">
          <Link to="/company/file-management/library"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Library</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title={`${file.name}.${file.extension}`}
          description={`Uploaded on ${new Date(file.uploadedAt).toLocaleString()} by ${file.owner}`}
        />
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" /> Archive
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PreviewPanel file={file} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {file.description && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600">{file.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">File Activity</h3>
            {fileActivity.length > 0 ? (
              <ActivityTable activities={fileActivity} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                No activity records for this file yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
