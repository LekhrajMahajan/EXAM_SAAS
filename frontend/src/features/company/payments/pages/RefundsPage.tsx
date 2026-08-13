import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_REFUNDS } from '../utils/placeholder';
import { RefundCard } from '../components/RefundCard';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function RefundsPage() {
  const [status, setStatus] = useState('');

  const filtered = status
    ? DUMMY_REFUNDS.filter(r => r.status === status)
    : DUMMY_REFUNDS;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Management"
        description="Review, approve, and track all refund requests from candidates."
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search by refund ID, candidate..." />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {(['', 'Requested', 'Under Review', 'Approved', 'Processed', 'Rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap ${status === s ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(refund => <RefundCard key={refund.id} refund={refund} />)}
      </div>
    </div>
  );
}
