import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SETTLEMENTS } from '../utils/placeholder';
import { SettlementCard } from '../components/SettlementCard';
import { FinanceSummaryCard } from '../components/FinanceSummaryCard';

export function SettlementsPage() {
  const totalSettled = DUMMY_SETTLEMENTS.filter(s => s.status === 'Settled').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlement Reports"
        description="Track gateway settlement cycles, amounts, and bank credit status."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FinanceSummaryCard title="Total Settled" value={`₹${(totalSettled / 100000).toFixed(1)}L`} accent="border-l-emerald-500" />
        <FinanceSummaryCard title="Processing" value="₹9.2L" accent="border-l-indigo-500" />
        <FinanceSummaryCard title="Pending" value="₹0" accent="border-l-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_SETTLEMENTS.map(s => <SettlementCard key={s.id} settlement={s} />)}
      </div>
    </div>
  );
}
