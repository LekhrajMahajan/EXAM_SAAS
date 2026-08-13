import React from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';
import { mockBuildInfo } from '../utils/placeholders';
import { GitCommit, Calendar, Tag, Server } from 'lucide-react';

export function BuildInformationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Build Information</h1>
        <p className="text-sm text-slate-500">Current application version and deployment metadata.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Tag className="w-8 h-8 text-indigo-600 mb-4" />
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Version</p>
          <h3 className="text-2xl font-bold text-slate-900">{mockBuildInfo.version}</h3>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Server className="w-8 h-8 text-sky-600 mb-4" />
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Build Number</p>
          <h3 className="text-2xl font-bold text-slate-900">{mockBuildInfo.buildNumber}</h3>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <GitCommit className="w-8 h-8 text-emerald-600 mb-4" />
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Git Commit</p>
          <h3 className="text-2xl font-bold text-slate-900 font-mono">{mockBuildInfo.commit.substring(0, 7)}</h3>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Calendar className="w-8 h-8 text-amber-600 mb-4" />
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Build Date</p>
          <h3 className="text-lg font-bold text-slate-900">{new Date(mockBuildInfo.date).toLocaleDateString()}</h3>
        </div>
      </div>

      <DeveloperCard title="Release Notes (Placeholder)">
        <div className="p-6 prose prose-slate max-w-none">
          <h3 className="text-lg font-bold">What's New in {mockBuildInfo.version}</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
            <li>Introduced Developer Tools dashboard for internal diagnostics.</li>
            <li>Refactored shared datatable component for better performance.</li>
            <li>Added fallback error boundaries across major routing nodes.</li>
            <li>Fixed issue with timezone conversions in exam scheduling.</li>
          </ul>
        </div>
      </DeveloperCard>
    </div>
  );
}
