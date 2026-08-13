import React from 'react';
import type { FileActivity } from '../types';
import { Upload, Download, Edit, Move, Trash2, RotateCcw, Archive, Share2 } from 'lucide-react';

function ActionIcon({ action }: { action: FileActivity['action'] }) {
  switch (action) {
    case 'Upload': return <Upload className="w-4 h-4 text-indigo-600" />;
    case 'Download': return <Download className="w-4 h-4 text-emerald-600" />;
    case 'Rename': return <Edit className="w-4 h-4 text-amber-600" />;
    case 'Move': return <Move className="w-4 h-4 text-sky-600" />;
    case 'Delete': return <Trash2 className="w-4 h-4 text-red-600" />;
    case 'Restore': return <RotateCcw className="w-4 h-4 text-violet-600" />;
    case 'Archive': return <Archive className="w-4 h-4 text-slate-600" />;
    case 'Share': return <Share2 className="w-4 h-4 text-teal-600" />;
  }
}

function actionColor(action: FileActivity['action']) {
  switch (action) {
    case 'Upload': return 'bg-indigo-50';
    case 'Download': return 'bg-emerald-50';
    case 'Rename': return 'bg-amber-50';
    case 'Move': return 'bg-sky-50';
    case 'Delete': return 'bg-red-50';
    case 'Restore': return 'bg-violet-50';
    case 'Archive': return 'bg-slate-100';
    case 'Share': return 'bg-teal-50';
  }
}

export function ActivityTable({ activities }: { activities: FileActivity[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
              <th scope="col" className="px-4 py-3 font-semibold">File</th>
              <th scope="col" className="px-4 py-3 font-semibold">Performed By</th>
              <th scope="col" className="px-4 py-3 font-semibold">Timestamp</th>
              <th scope="col" className="px-4 py-3 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${actionColor(activity.action)}`}>
                    <ActionIcon action={activity.action} />
                    <span className="text-xs font-bold text-slate-900">{activity.action}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 max-w-[200px] truncate" title={activity.fileName}>{activity.fileName}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">{activity.performedBy}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{new Date(activity.performedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{activity.details ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
