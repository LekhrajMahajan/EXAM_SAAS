import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_GATEWAYS } from '../utils/placeholder';
import { GatewayCard } from '../components/GatewayCard';
import { Button } from '@/shared/components/ui/button';
import { Settings } from 'lucide-react';

export function PaymentGatewaysPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="Payment Gateways"
          description="Manage and monitor payment gateway integrations (Razorpay, Stripe, PayU, Cashfree)."
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Settings className="w-4 h-4 mr-2" /> Configure Gateway
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <span className="font-bold">Note:</span> Gateway credentials are stored securely and never exposed in the UI. Changes to gateway configuration require admin authentication.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DUMMY_GATEWAYS.map(gw => <GatewayCard key={gw.id} gateway={gw} />)}
      </div>
    </div>
  );
}
