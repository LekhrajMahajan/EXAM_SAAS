import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSettingsSchema, type PaymentSettingsForm } from '../schemas/payment-schemas';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Save, ShieldCheck } from 'lucide-react';

export function PaymentSettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentSettingsForm>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      currency: 'INR',
      taxPercent: 18,
      receiptPrefix: 'RCP',
      invoicePrefix: 'INV',
      autoReceipt: true,
      lateFeeDays: 7,
      lateFeeAmount: 200,
    }
  });

  const onSubmit = (data: PaymentSettingsForm) => console.log('Settings:', data);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Payment Settings"
        description="Configure currency, taxes, receipt/invoice prefixes, and automation rules."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">General</h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Currency</label>
            <select {...register('currency')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Default Tax (%)</label>
            <Input type="number" step="0.01" {...register('taxPercent', { valueAsNumber: true })} />
            {errors.taxPercent && <p className="text-[10px] text-red-500 font-bold">{errors.taxPercent.message}</p>}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Numbering</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Receipt Prefix</label>
              <Input {...register('receiptPrefix')} placeholder="e.g. RCP" className="uppercase" />
              {errors.receiptPrefix && <p className="text-[10px] text-red-500 font-bold">{errors.receiptPrefix.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Invoice Prefix</label>
              <Input {...register('invoicePrefix')} placeholder="e.g. INV" className="uppercase" />
              {errors.invoicePrefix && <p className="text-[10px] text-red-500 font-bold">{errors.invoicePrefix.message}</p>}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Automation</h3>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-slate-900 text-sm">Auto-Generate Receipts</div>
              <div className="text-xs text-slate-500 mt-0.5">Automatically generate and email receipts after successful payment.</div>
            </div>
            <input type="checkbox" {...register('autoReceipt')} className="w-5 h-5 text-indigo-600 rounded border-slate-300 cursor-pointer" />
          </label>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Late Fee Policy</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Grace Period (days)</label>
              <Input type="number" {...register('lateFeeDays', { valueAsNumber: true })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Late Fee Amount (₹)</label>
              <Input type="number" {...register('lateFeeAmount', { valueAsNumber: true })} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Payment Gateway Credentials</h3>
              <p className="text-sm text-slate-600">Gateway API keys and secrets are managed securely and cannot be viewed or edited here. Use the <strong>Gateway Configuration</strong> page to update them.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
