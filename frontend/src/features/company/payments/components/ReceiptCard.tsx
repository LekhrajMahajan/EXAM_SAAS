import React from 'react';
import type { Receipt } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, Printer } from 'lucide-react';

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-mono text-xs font-bold text-emerald-700">{receipt.receiptNumber}</div>
            <div className="font-bold text-slate-900 mt-1">{receipt.candidateName}</div>
            <div className="text-xs text-slate-500">{receipt.exam}</div>
          </div>
          <span className="text-xl font-bold text-slate-900">₹{receipt.amount.toLocaleString('en-IN')}</span>
        </div>

        <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
          <div className="flex justify-between text-slate-600">
            <span>Application</span><span className="font-mono font-bold text-slate-800">{receipt.applicationNumber}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Method</span><span className="font-bold text-slate-800">{receipt.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Issued At</span><span>{new Date(receipt.issuedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-1 mt-4 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Printer className="w-3.5 h-3.5 mr-1" /> Print
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
            <Download className="w-3.5 h-3.5 mr-1" /> Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
