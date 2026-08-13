import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FILES } from '../utils/placeholder';
import { FileTable } from '../components/FileTable';
import { Button } from '@/shared/components/ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';

export function ArchivePage() {
  const archivedFiles = DUMMY_FILES.filter(f => f.status === 'Archived');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="Archive"
          description="View and manage archived files. Restore or permanently delete archived documents."
        />
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" /> Empty Archive
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <span className="font-bold">Note:</span> Archived files are kept based on their category retention policy. Files past their retention period are marked for permanent deletion.
      </div>

      {archivedFiles.length > 0 ? (
        <FileTable files={archivedFiles} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <RotateCcw className="w-8 h-8 mx-auto mb-3" />
          <p className="font-medium">No archived files found.</p>
        </div>
      )}
    </div>
  );
}
