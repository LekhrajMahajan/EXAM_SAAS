import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_OFFLINE_RESULTS } from '../utils/placeholder';
import { OfflineResultCard } from '../components/OfflineResultCard';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';

export function OfflineResultsPage() {
  const passed = DUMMY_OFFLINE_RESULTS.filter(r => r.result === 'Pass').length;
  const failed = DUMMY_OFFLINE_RESULTS.filter(r => r.result === 'Fail').length;
  const absent = DUMMY_OFFLINE_RESULTS.filter(r => r.result === 'Absent').length;
  const passPercent = DUMMY_OFFLINE_RESULTS.length > 0
    ? Math.round((passed / (DUMMY_OFFLINE_RESULTS.length - absent)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Offline Results" description="View candidate results from offline exams after OMR processing and manual evaluation." />
        <Button variant="outline" className="bg-white">
          <Download className="w-4 h-4 mr-2" /> Export Results
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-800">{passed}</div>
          <div className="text-xs font-bold text-emerald-600 uppercase mt-1">Passed</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-800">{failed}</div>
          <div className="text-xs font-bold text-red-600 uppercase mt-1">Failed</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{absent}</div>
          <div className="text-xs font-bold text-slate-500 uppercase mt-1">Absent</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-800">{passPercent}%</div>
          <div className="text-xs font-bold text-indigo-600 uppercase mt-1">Pass %</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_OFFLINE_RESULTS.map(r => <OfflineResultCard key={r.id} result={r} />)}
      </div>
    </div>
  );
}
