import React from 'react';
import type { RefundRequest, RefundStatus } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle, XCircle, Clock, CheckCheck, AlertCircle } from 'lucide-react';

function RefundStatusBadge({ status }: { status: RefundStatus }) {
  const map: Record<RefundStatus, { cls: string; icon: React.ReactNode }> = {
    Requested: { cls: 'bg-sky-100 text-sky-700 border-sky-200', icon: <Clock className="w-3 h-3" /> },
    'Under Review': { cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AlertCircle className="w-3 h-3" /> },
    Approved: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
    Processed: { cls: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <CheckCheck className="w-3 h-3" /> },
    Rejected: { cls: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" /> },
  };
  const { cls, icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${cls}`}>
      {icon} {status}
    </span>
  );
}

export function RefundCard({ refund }: { refund: RefundRequest }) {
  const canAct = refund.status === 'Requested' || refund.status === 'Under Review';

  return (
    <Card className="border-slate-200 shadow-sm hover:border-violet-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-mono text-xs font-bold text-violet-700">{refund.refundId}</div>
            <div className="font-bold text-slate-900 mt-1">{refund.candidateName}</div>
            <div className="text-xs text-slate-500">{refund.applicationNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-900">₹{refund.amount.toLocaleString('en-IN')}</div>
            <div className="mt-1"><RefundStatusBadge status={refund.status} /></div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mb-3 border border-slate-100">
          <span className="font-bold text-slate-700">Reason: </span>{refund.reason}
        </div>

        <div className="text-[10px] text-slate-400 mb-3">
          Requested: {new Date(refund.requestedAt).toLocaleString()}
          {refund.processedAt && ` · Processed: ${new Date(refund.processedAt).toLocaleString()}`}
        </div>

        {canAct && (
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50 text-xs h-8">
              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
