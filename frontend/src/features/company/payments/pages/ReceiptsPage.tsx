import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_RECEIPTS } from '../utils/placeholder';
import { ReceiptCard } from '../components/ReceiptCard';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payment Receipts" description="View and re-print official receipts for all successful transactions." />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input className="pl-9" placeholder="Search by receipt number, candidate, application..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_RECEIPTS.map(r => <ReceiptCard key={r.id} receipt={r} />)}
      </div>
    </div>
  );
}
