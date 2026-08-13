import React from 'react';
import type { Transaction } from '../types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Eye, FileText } from 'lucide-react';

const GATEWAY_COLORS: Record<string, string> = {
  Razorpay: 'bg-blue-50 text-blue-700',
  Stripe: 'bg-violet-50 text-violet-700',
  PayU: 'bg-orange-50 text-orange-700',
  Cashfree: 'bg-teal-50 text-teal-700',
  Internal: 'bg-slate-100 text-slate-600',
};

const METHOD_COLORS: Record<string, string> = {
  UPI: 'bg-indigo-50 text-indigo-700',
  'Net Banking': 'bg-sky-50 text-sky-700',
  'Credit Card': 'bg-emerald-50 text-emerald-700',
  'Debit Card': 'bg-green-50 text-green-700',
  Wallet: 'bg-amber-50 text-amber-700',
  Challan: 'bg-slate-100 text-slate-600',
};

export function PaymentTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Transaction ID</th>
              <th scope="col" className="px-4 py-3 font-semibold">Candidate</th>
              <th scope="col" className="px-4 py-3 font-semibold">Exam</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Amount</th>
              <th scope="col" className="px-4 py-3 font-semibold">Method</th>
              <th scope="col" className="px-4 py-3 font-semibold">Gateway</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-mono text-xs font-bold text-indigo-700">{txn.transactionId}</div>
                  <div className="text-[10px] text-slate-400">{txn.applicationNumber}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{txn.candidateName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="max-w-[140px] truncate text-slate-700" title={txn.exam}>{txn.exam}</div>
                  <div className="text-[10px] text-slate-400">{txn.feeType}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-slate-900">
                  ₹{txn.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${METHOD_COLORS[txn.paymentMethod] ?? 'bg-slate-100 text-slate-600'}`}>
                    {txn.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${GATEWAY_COLORS[txn.gateway] ?? 'bg-slate-100 text-slate-600'}`}>
                    {txn.gateway}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <div className="flex justify-center"><PaymentStatusBadge status={txn.status} /></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-xs text-slate-600">{new Date(txn.transactionDate).toLocaleDateString()}</div>
                  <div className="text-[10px] text-slate-400">{new Date(txn.transactionDate).toLocaleTimeString()}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-600">
                    <FileText className="w-4 h-4" />
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
