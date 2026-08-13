import React from 'react';
import type { ReportHistoryRecord } from '../types';
import { CheckCircle, XCircle, FileText, Download, Clock } from 'lucide-react';

interface HistoryTableProps {
  history: ReportHistoryRecord[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'Generated': return <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs font-semibold"><FileText className="w-3 h-3 mr-1" /> {action}</span>;
      case 'Downloaded': return <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-semibold"><Download className="w-3 h-3 mr-1" /> {action}</span>;
      case 'Scheduled Run': return <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-semibold"><Clock className="w-3 h-3 mr-1" /> {action}</span>;
      default: return action;
    }
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
              <th scope="col" className="px-6 py-4">Action</th>
              <th scope="col" className="px-6 py-4">Report</th>
              <th scope="col" className="px-6 py-4">Triggered By</th>
              <th scope="col" className="px-6 py-4">Timestamp</th>
              <th scope="col" className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {getActionIcon(record.action)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {record.reportName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium">
                  {record.triggeredBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-500">
                  {record.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(record.status)}
                    <span className="text-xs font-semibold">{record.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
