import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { Download, Users, ScanLine, ClipboardList, Building2, FileBarChart2 } from 'lucide-react';

const REPORTS = [
  { title: 'Attendance Report', desc: 'Room-wise and overall candidate attendance for each session.', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'OMR Report', desc: 'Batch-wise OMR processing status, rejection summary, and scanner logs.', icon: ScanLine, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Evaluation Report', desc: 'Evaluator-wise marks entry progress and pending sheet status.', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Center Report', desc: 'Center-wise session summary with attendance, materials, and OMR data.', icon: Building2, color: 'text-violet-600', bg: 'bg-violet-50' },
  { title: 'Summary Report', desc: 'Complete offline exam summary including all modules and statistics.', icon: FileBarChart2, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export function OfflineReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Offline Exam Reports" description="Generate and download detailed reports for attendance, OMR, evaluation, and centers." />
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Exams</option>
          <option>SSC CGL 2026</option>
          <option>IBPS PO 2026</option>
          <option>RRB NTPC 2026</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Centers</option>
          <option>Delhi Centre 01</option>
          <option>Mumbai Centre 02</option>
        </select>
        <input type="date" className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" />
        <input type="date" className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(report => (
          <div key={report.title} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 transition-colors group">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${report.bg} ${report.color} flex items-center justify-center flex-shrink-0`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900">{report.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{report.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" className="flex-1 text-xs">Preview</Button>
              <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
