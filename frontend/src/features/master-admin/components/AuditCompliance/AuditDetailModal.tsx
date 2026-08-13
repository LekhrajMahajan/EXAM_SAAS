import React from 'react';
import type { AuditLog } from '../../types/audit-log.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

import { Badge } from '@/shared/components/ui/badge';
import { Monitor, User, Shield, Activity, Calendar, FileText } from 'lucide-react';

interface AuditDetailModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl border-b pb-4">
            <Shield className="w-5 h-5 text-indigo-500" />
            Security Audit Record
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="pr-4 mt-2" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border">
              <div>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> Timestamp
                </p>
                <p className="font-medium text-sm">
                  {new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3" /> Action
                </p>
                <Badge variant="outline" className="font-mono">{log.action}</Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                  <FileText className="w-3 h-3" /> Module
                </p>
                <p className="font-medium text-sm">{log.module}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3" /> Status
                </p>
                <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                  {log.status}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">
                {log.description}
              </p>
            </div>

            {/* Context Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-3 border-b pb-2">
                  <User className="w-4 h-4 text-slate-400" /> Performed By
                </h4>
                {log.performedBy ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                      <span className="text-slate-500">Name</span>
                      <span className="font-medium">{((log.performedBy as any)?.firstName || 'Unknown')} {((log.performedBy as any)?.lastName || '')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                      <span className="text-slate-500">Email</span>
                      <span className="font-medium">{((log.performedBy as any)?.email || 'N/A')}</span>
                    </div>
                    {log.performedByRole && (
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                        <span className="text-slate-500">Role</span>
                        <Badge variant="secondary">{log.performedByRole}</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded text-sm text-slate-500 text-center italic border border-dashed">
                    System Action
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-3 border-b pb-2">
                  <Monitor className="w-4 h-4 text-slate-400" /> Client Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                    <span className="text-slate-500">IP Address</span>
                    <span className="font-mono text-xs">{log.ipAddress || 'Unknown'}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded text-sm">
                    <span className="text-slate-500 block mb-1">User Agent</span>
                    <span className="text-xs text-slate-600 break-all">{log.userAgent || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes (Old / New Values) */}
            {(log.oldData || log.newData) && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 border-b pb-2">Data Changes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {log.oldData && (
                    <div className="border border-red-200 rounded-md overflow-hidden">
                      <div className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-2 border-b border-red-200">
                        Previous State
                      </div>
                      <pre className="p-3 bg-slate-50 text-xs overflow-x-auto text-slate-600 max-h-48">
                        {JSON.stringify(log.oldData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.newData && (
                    <div className="border border-emerald-200 rounded-md overflow-hidden">
                      <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-2 border-b border-emerald-200">
                        New State
                      </div>
                      <pre className="p-3 bg-slate-50 text-xs overflow-x-auto text-slate-600 max-h-48">
                        {JSON.stringify(log.newData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Entity Info */}
            {(log.entityId || log.entityName) && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-slate-400 font-mono">
                  Entity ID: {log.entityId} {log.entityName ? `(${log.entityName})` : ''} • Record ID: {log._id}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
