import React from 'react';
import type { Settlement } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

function SettlementStatusBadge({ status }: { status: Settlement['status'] }) {
  switch (status) {
    case 'Settled': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Settled</span>;
    case 'Pending': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
    case 'Processing': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
  }
}

export function SettlementCard({ settlement }: { settlement: Settlement }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-mono text-xs font-bold text-indigo-700">{settlement.settlementId}</div>
            <div className="font-bold text-slate-900 mt-1">{settlement.gateway}</div>
          </div>
          <SettlementStatusBadge status={settlement.status} />
        </div>

        <div className="space-y-1.5 text-sm text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-bold text-slate-900">₹{(settlement.amount / 100000).toFixed(1)}L</span>
          </div>
          <div className="flex justify-between">
            <span>Transactions</span>
            <span className="font-bold text-slate-900">{settlement.transactionCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Bank Account</span>
            <span className="font-mono text-xs font-bold text-slate-700">{settlement.bankAccount}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1">
            <span>Settlement Date</span>
            <span>{new Date(settlement.settlementDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
