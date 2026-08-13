import React from 'react';
import type { PaymentGatewayConfig, GatewayStatus } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Wifi, WifiOff, FlaskConical, AlertTriangle } from 'lucide-react';

function GatewayStatusBadge({ status }: { status: GatewayStatus }) {
  switch (status) {
    case 'Active': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200"><Wifi className="w-3 h-3" /> Active</span>;
    case 'Inactive': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"><WifiOff className="w-3 h-3" /> Inactive</span>;
    case 'Test Mode': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200"><FlaskConical className="w-3 h-3" /> Test Mode</span>;
    case 'Error': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200"><AlertTriangle className="w-3 h-3" /> Error</span>;
  }
}

const GATEWAY_ACCENT: Record<string, string> = {
  Razorpay: 'border-blue-300 bg-blue-50/30',
  Stripe: 'border-violet-300 bg-violet-50/30',
  PayU: 'border-orange-300 bg-orange-50/30',
  Cashfree: 'border-teal-300 bg-teal-50/30',
};

export function GatewayCard({ gateway }: { gateway: PaymentGatewayConfig }) {
  return (
    <Card className={`shadow-sm transition-colors hover:shadow-md border ${GATEWAY_ACCENT[gateway.name] ?? 'border-slate-200'}`}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-slate-900">{gateway.name}</h3>
          <GatewayStatusBadge status={gateway.status} />
        </div>

        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex justify-between">
            <span>Success Rate</span>
            <span className="font-bold text-emerald-700">{gateway.successRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>Transactions</span>
            <span className="font-bold text-slate-900">{gateway.totalTransactions.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Volume</span>
            <span className="font-bold text-slate-900">₹{(gateway.totalVolume / 100000).toFixed(1)}L</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Supported Methods</p>
          <div className="flex flex-wrap gap-1">
            {gateway.supportedMethods.map(m => (
              <span key={m} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{m}</span>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
          Last Sync: {new Date(gateway.lastSync).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
