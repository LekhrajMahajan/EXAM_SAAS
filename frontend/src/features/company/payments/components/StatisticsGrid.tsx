import React from 'react';
import type { PaymentStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { IndianRupee, TrendingUp, Clock, CheckCircle2, XCircle, RotateCcw, AlertCircle, Wallet } from 'lucide-react';

const fmt = (n: number) => `₹${n >= 1_00_000 ? `${(n / 1_00_000).toFixed(1)}L` : n.toLocaleString('en-IN')}`;

export function StatisticsGrid({ stats }: { stats: PaymentStatistics }) {
  const cards = [
    { label: 'Total Collections', value: fmt(stats.totalCollections), icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: "Today's Collection", value: fmt(stats.todayCollection), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Payments', value: stats.pendingPayments.toLocaleString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Successful', value: stats.successfulPayments.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Failed Payments', value: stats.failedPayments.toLocaleString(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Refund Requests', value: stats.refundRequests.toLocaleString(), icon: RotateCcw, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Refunds Processed', value: stats.processedRefunds.toLocaleString(), icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Outstanding', value: fmt(stats.outstandingAmount), icon: Wallet, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-2`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase leading-tight">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
