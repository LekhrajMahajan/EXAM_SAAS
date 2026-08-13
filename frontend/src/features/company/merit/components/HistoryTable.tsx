import React from 'react';
import type { MeritHistoryRecord } from '../types';
import { FileDown, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface HistoryTableProps {
  history: MeritHistoryRecord[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'In Progress': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    if (action === 'Generation') {
       return <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-xs font-semibold">Generation</span>;
    }
    return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">Publishing</span>;
  };

  if (history.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">Job ID & Action</th>
              <th scope="col" className="px-6 py-4">Context</th>
              <th scope="col" className="px-6 py-4">Triggered By</th>
              <th scope="col" className="px-6 py-4">Time</th>
              <th scope="col" className="px-6 py-4">Records</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono text-slate-900 font-semibold mb-1">{record.jobId}</div>
                  {getActionBadge(record.action)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{record.exam}</div>
                  <div className="text-xs text-slate-500">{record.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                  {record.triggeredBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                  {record.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
                  {record.recordsProcessed.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <span className="text-xs font-medium">{record.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" disabled={record.status !== 'Success'}>
                    <FileDown className="w-4 h-4 mr-2" />
                    List
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
