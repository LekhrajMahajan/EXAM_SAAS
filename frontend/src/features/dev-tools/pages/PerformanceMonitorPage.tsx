import React from 'react';
import { DeveloperCard, StatisticsGrid } from '../components/DeveloperComponents';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';

export function PerformanceMonitorPage() {
  const metrics = [
    { label: 'Page Load (TTFB)', value: '120ms', icon: Zap, colorClass: 'bg-amber-100 text-amber-600' },
    { label: 'First Contentful Paint', value: '0.8s', icon: Activity, colorClass: 'bg-emerald-100 text-emerald-600' },
    { label: 'JS Heap Size', value: '45 MB', icon: HardDrive, colorClass: 'bg-indigo-100 text-indigo-600' },
    { label: 'Active DOM Nodes', value: '1,245', icon: Cpu, colorClass: 'bg-sky-100 text-sky-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Performance Monitor</h1>
        <p className="text-sm text-slate-500">Client-side rendering metrics and bundle placeholders.</p>
      </div>

      <StatisticsGrid stats={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeveloperCard title="Bundle Sizes (Placeholder)">
          <div className="p-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">vendor.js</span>
                <span className="text-slate-500">845 KB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">main.js</span>
                <span className="text-slate-500">210 KB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">design-system.js</span>
                <span className="text-slate-500">45 KB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </DeveloperCard>

        <DeveloperCard title="Network Requests (Simulated)">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 font-semibold text-slate-700">Resource</th>
                  <th className="px-4 py-2 font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-2 font-semibold text-slate-700 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 text-slate-900 truncate max-w-[200px]">/api/v1/users/me</td>
                  <td className="px-4 py-2 text-slate-500">fetch</td>
                  <td className="px-4 py-2 text-emerald-600 text-right">45ms</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900 truncate max-w-[200px]">/assets/inter-regular.woff2</td>
                  <td className="px-4 py-2 text-slate-500">font</td>
                  <td className="px-4 py-2 text-amber-600 text-right">120ms</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900 truncate max-w-[200px]">/api/v1/dashboard/stats</td>
                  <td className="px-4 py-2 text-slate-500">fetch</td>
                  <td className="px-4 py-2 text-emerald-600 text-right">82ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DeveloperCard>
      </div>
    </div>
  );
}
