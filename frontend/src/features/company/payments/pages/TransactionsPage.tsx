import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_TRANSACTIONS } from '../utils/placeholder';
import { PaymentTable } from '../components/PaymentTable';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';

export function TransactionsPage() {
  const [status, setStatus] = useState('');

  const filtered = status
    ? DUMMY_TRANSACTIONS.filter(t => t.status === status)
    : DUMMY_TRANSACTIONS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Transactions" description="View and search all payment transactions across gateways and methods." />
        <Button variant="outline" className="bg-white">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search by Txn ID, candidate, application..." />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <option value="">All Statuses</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Gateways</option>
          <option value="Razorpay">Razorpay</option>
          <option value="Stripe">Stripe</option>
          <option value="Cashfree">Cashfree</option>
          <option value="PayU">PayU</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
        </select>
        <Button variant="outline" className="bg-white">
          <Filter className="w-4 h-4 mr-2" /> More Filters
        </Button>
      </div>

      <PaymentTable transactions={filtered} />
    </div>
  );
}
