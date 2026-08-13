import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_PAYMENT_STATS, DUMMY_TRANSACTIONS, DUMMY_GATEWAYS } from '../utils/placeholder';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { PaymentTable } from '../components/PaymentTable';
import { GatewayCard } from '../components/GatewayCard';
import { FinanceSummaryCard } from '../components/FinanceSummaryCard';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PaymentDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="Payment & Finance Management"
          description="Monitor collections, transactions, gateways, and refunds in real-time."
        />
        <Button variant="outline" className="bg-white">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      <StatisticsGrid stats={DUMMY_PAYMENT_STATS} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceSummaryCard title="Total Collections" value="₹4.87 Cr" subtitle="All time" trend={{ value: '+12.4%', positive: true }} accent="border-l-indigo-500" />
        <FinanceSummaryCard title="This Month" value="₹38.2 L" subtitle="October 2026" trend={{ value: '+8.1%', positive: true }} accent="border-l-emerald-500" />
        <FinanceSummaryCard title="Refunds Issued" value="₹2.18 L" subtitle="This month" trend={{ value: '-3.2%', positive: false }} accent="border-l-violet-500" />
        <FinanceSummaryCard title="Net Revenue" value="₹35.9 L" subtitle="After refunds" trend={{ value: '+9.0%', positive: true }} accent="border-l-rose-500" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
            <Link to="/company/payments/transactions">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        <PaymentTable transactions={DUMMY_TRANSACTIONS.slice(0, 5)} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold text-slate-900">Payment Gateways</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
            <Link to="/company/payments/gateways">Manage <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DUMMY_GATEWAYS.map(gw => <GatewayCard key={gw.id} gateway={gw} />)}
        </div>
      </div>
    </div>
  );
}
