import React from 'react';
import type { AuditLog } from '../../types/audit-log.types';
import { AuditSeverity } from '../../types/audit-log.types';
import { Badge } from '@/shared/components/ui/badge';

import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case AuditSeverity.CRITICAL:
      return <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Critical</Badge>;
    case AuditSeverity.HIGH:
      return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High</Badge>;
    case AuditSeverity.MEDIUM:
      return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1"><Shield className="w-3 h-3" /> Medium</Badge>;
    case AuditSeverity.LOW:
    default:
      return <Badge variant="outline" className="text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Low</Badge>;
  }
};

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onViewDetails }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-medium">Timestamp</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Module</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">IP Address</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                No Security Audit Records Found
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{log.action}</td>
                <td className="px-4 py-3 text-slate-600">{log.module}</td>
                <td className="px-4 py-3">{getSeverityBadge(log.severity)}</td>
                <td className="px-4 py-3">
                  {log.performedBy ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                        {((log.performedBy as any)?.firstName?.[0] || 'U')}
                      </div>
                      <span>{((log.performedBy as any)?.firstName || 'Unknown')} {((log.performedBy as any)?.lastName || '')}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">System</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{log.ipAddress || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails(log)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
