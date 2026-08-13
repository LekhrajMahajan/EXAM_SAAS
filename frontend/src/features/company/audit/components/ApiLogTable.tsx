import React from 'react';
import type { ApiLog } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Code2, ArrowRightLeft } from 'lucide-react';

interface ApiLogTableProps {
  logs: ApiLog[];
}

export function ApiLogTable({ logs }: ApiLogTableProps) {
  
  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-blue-100 text-blue-700';
      case 'POST': return 'bg-emerald-100 text-emerald-700';
      case 'PUT': return 'bg-amber-100 text-amber-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-600';
    if (status >= 400 && status < 500) return 'text-amber-600';
    if (status >= 500) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Timestamp / IP</th>
              <th scope="col" className="px-4 py-3 font-semibold">Endpoint</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Time (ms)</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Payload Size</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 font-mono text-xs">
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                   <div>{log.timestamp}</div>
                   <div className="text-[10px]">{log.ipAddress}</div>
                </td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${getMethodColor(log.method)}`}>{log.method}</span>
                      <span className="text-slate-900 truncate max-w-[300px]" title={log.endpoint}>{log.endpoint}</span>
                   </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <span className={`font-bold ${getStatusColor(log.responseStatus)}`}>{log.responseStatus}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                   <span className={log.executionTimeMs > 1000 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                     {log.executionTimeMs}ms
                   </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                      <span>{log.requestSizeKb} KB</span>
                      <ArrowRightLeft className="w-3 h-3 text-slate-300" />
                      <span>{log.responseSizeKb} KB</span>
                   </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600">
                      <Code2 className="w-4 h-4" />
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
