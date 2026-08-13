import React from 'react';
import type { Transaction } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { IndianRupee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TransactionCard({ txn }: { txn: Transaction }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-mono text-xs font-bold text-indigo-700">{txn.transactionId}</div>
            <div className="font-bold text-slate-900 mt-1">{txn.candidateName}</div>
            <div className="text-xs text-slate-500">{txn.applicationNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-900 flex items-center justify-end gap-0.5">
              <IndianRupee className="w-4 h-4" />{txn.amount.toLocaleString('en-IN')}
            </div>
            <div className="mt-1"><PaymentStatusBadge status={txn.status} /></div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>{txn.paymentMethod} · {txn.gateway}</span>
          <span>{new Date(txn.transactionDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
