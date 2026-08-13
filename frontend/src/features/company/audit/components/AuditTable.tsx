import React from 'react';
import type { AuditRecord } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { Eye, Shield, KeyRound, Monitor, FileText, Settings, Webhook } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface AuditTableProps {
  logs: AuditRecord[];
}

export function AuditTable({ logs }: AuditTableProps) {
  
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Security': return <Shield className="w-3.5 h-3.5 text-red-500" />;
      case 'Authentication': return <KeyRound className="w-3.5 h-3.5 text-amber-500" />;
      case 'System': return <Settings className="w-3.5 h-3.5 text-slate-500" />;
      case 'Exam': return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
      case 'API': return <Webhook className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Monitor className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Timestamp</th>
              <th scope="col" className="px-4 py-3 font-semibold">User</th>
              <th scope="col" className="px-4 py-3 font-semibold">Module</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action / Description</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Severity</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-500">
                   {log.timestamp}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="font-medium text-slate-900">{log.userName}</div>
                   <div className="text-[10px] text-slate-500 uppercase">{log.role}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                      {getModuleIcon(log.module)}
                      <span className="text-xs font-medium text-slate-700">{log.module}</span>
                   </div>
                </td>
                <td className="px-4 py-3 max-w-[250px]">
                   <div className="font-semibold text-slate-900 truncate" title={log.action}>{log.action}</div>
                   <div className="text-xs text-slate-500 truncate" title={log.description}>{log.description}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <div className="flex justify-center"><StatusBadge status={log.status} /></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                   <SeverityBadge severity={log.severity} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600">
                      <Eye className="w-4 h-4" />
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
