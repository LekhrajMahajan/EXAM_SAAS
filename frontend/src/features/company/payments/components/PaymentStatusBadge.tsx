import React from 'react';
import type { PaymentStatus } from '../types';
import { CheckCircle2, Clock, XCircle, RotateCcw, AlertCircle } from 'lucide-react';

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case 'Successful':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Successful
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    case 'Failed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3" /> Failed
        </span>
      );
    case 'Refunded':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-100 text-violet-700 border border-violet-200">
          <RotateCcw className="w-3 h-3" /> Refunded
        </span>
      );
    case 'Partial Refund':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700 border border-orange-200">
          <AlertCircle className="w-3 h-3" /> Partial Refund
        </span>
      );
  }
}
