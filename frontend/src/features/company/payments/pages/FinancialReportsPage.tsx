import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { FinanceSummaryCard } from '../components/FinanceSummaryCard';
import { Button } from '@/shared/components/ui/button';
import { Download, TrendingUp } from 'lucide-react';

const METHOD_SUMMARY = [
  { method: 'UPI', amount: '₹28.4L', share: 58, color: 'bg-indigo-500' },
  { method: 'Net Banking', amount: '₹12.1L', share: 25, color: 'bg-sky-500' },
  { method: 'Credit Card', amount: '₹4.8L', share: 10, color: 'bg-emerald-500' },
  { method: 'Debit Card', amount: '₹2.9L', share: 6, color: 'bg-amber-500' },
  { method: 'Wallet', amount: '₹0.5L', share: 1, color: 'bg-violet-500' },
];

export function FinancialReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Financial Reports" description="Summary of collections, refunds, and revenue breakdowns." />
        <Button variant="outline" className="bg-white">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceSummaryCard title="Gross Collections" value="₹48.7L" subtitle="All time" trend={{ value: '+12.4%', positive: true }} accent="border-l-indigo-500" />
        <FinanceSummaryCard title="Refunds Issued" value="₹2.18L" subtitle="All time" trend={{ value: '-3.2%', positive: false }} accent="border-l-violet-500" />
        <FinanceSummaryCard title="Net Revenue" value="₹46.6L" subtitle="After deductions" trend={{ value: '+11.8%', positive: true }} accent="border-l-emerald-500" />
        <FinanceSummaryCard title="Failed Payments" value="₹1.09L" subtitle="Lost revenue" trend={{ value: '+2.1%', positive: false }} accent="border-l-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Payment Method Breakdown</h3>
          <div className="space-y-4">
            {METHOD_SUMMARY.map(item => (
              <div key={item.method}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-slate-900">{item.method}</span>
                  <div className="flex gap-3">
                    <span className="text-slate-500">{item.amount}</span>
                    <span className="font-bold text-indigo-700">{item.share}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue Trend
          </h3>
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Revenue chart will be rendered here</p>
            <p className="text-xs mt-1">Integrate with Recharts or Chart.js</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Gateway Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Gateway</th>
                <th className="px-4 py-3 font-semibold text-right">Transactions</th>
                <th className="px-4 py-3 font-semibold text-right">Volume</th>
                <th className="px-4 py-3 font-semibold text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Razorpay', txns: '62,410', volume: '₹3.12 Cr', rate: '97.4%' },
                { name: 'Cashfree', txns: '18,920', volume: '₹94.6L', rate: '96.1%' },
                { name: 'Stripe', txns: '1,240', volume: '₹6.2L', rate: '99.2%' },
                { name: 'PayU', txns: '8,240', volume: '₹41.2L', rate: '94.8%' },
              ].map(row => (
                <tr key={row.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-right">{row.txns}</td>
                  <td className="px-4 py-3 text-right font-bold">{row.volume}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
