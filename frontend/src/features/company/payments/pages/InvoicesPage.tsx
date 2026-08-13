import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_INVOICES } from '../utils/placeholder';
import { InvoiceCard } from '../components/InvoiceCard';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Browse, preview, and download all candidate invoices." />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search by invoice number, candidate..." />
        </div>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Issued">Issued</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_INVOICES.map(inv => <InvoiceCard key={inv.id} invoice={inv} />)}
      </div>
    </div>
  );
}
