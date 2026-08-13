import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_OMR_BATCHES } from '../utils/placeholder';
import { OmrBatchTable } from '../components/OmrBatchTable';
import { Button } from '@/shared/components/ui/button';
import { Upload, ScanLine } from 'lucide-react';

export function OmrManagementPage() {
  const pending = DUMMY_OMR_BATCHES.reduce((s, b) => s + b.pendingSheets, 0);
  const processed = DUMMY_OMR_BATCHES.reduce((s, b) => s + b.processedSheets, 0);
  const rejected = DUMMY_OMR_BATCHES.reduce((s, b) => s + b.rejectedSheets, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="OMR Management" description="Track OMR batch uploads, scan progress, and processing status." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Upload className="w-4 h-4 mr-2" /> Upload OMR Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-800">{pending}</div>
          <div className="text-xs font-bold text-amber-600 uppercase mt-1">Pending Sheets</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-800">{processed}</div>
          <div className="text-xs font-bold text-indigo-600 uppercase mt-1">Processed Sheets</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-800">{rejected}</div>
          <div className="text-xs font-bold text-red-600 uppercase mt-1">Rejected Sheets</div>
        </div>
      </div>

      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <ScanLine className="w-10 h-10 text-slate-300 mb-3" />
        <p className="font-bold text-slate-500">OMR Scanner Integration</p>
        <p className="text-xs text-slate-400 mt-1">Connect OMR scanner hardware or upload scanned files for automated processing.</p>
        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Upload className="w-4 h-4 mr-2" /> Upload Scanned Files
        </Button>
      </div>

      <OmrBatchTable batches={DUMMY_OMR_BATCHES} />
    </div>
  );
}
