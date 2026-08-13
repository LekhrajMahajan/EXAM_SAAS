import React from 'react';
import type { Invoice, InvoiceStatus } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, Eye } from 'lucide-react';

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-200',
    Issued: 'bg-sky-100 text-sky-700 border-sky-200',
    Paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Overdue: 'bg-red-100 text-red-700 border-red-200',
    Cancelled: 'bg-slate-100 text-slate-500 border-slate-200 line-through',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${map[status]}`}>{status}</span>
  );
}

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-mono text-xs font-bold text-indigo-700">{invoice.invoiceNumber}</div>
            <div className="font-bold text-slate-900 mt-1">{invoice.candidateName}</div>
            <div className="text-xs text-slate-500">{invoice.exam}</div>
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </div>

        <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex justify-between"><span>Amount</span><span className="font-bold">₹{invoice.amount.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Tax</span><span className="font-bold">₹{invoice.taxAmount.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-slate-900 font-bold border-t border-slate-100 pt-1 mt-1"><span>Total</span><span>₹{invoice.totalAmount.toLocaleString('en-IN')}</span></div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
          <div className="text-[10px] text-slate-400">Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600"><Eye className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600"><Download className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
