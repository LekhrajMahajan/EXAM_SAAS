import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FEES } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

export function FeeManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="Fee Management"
          description="Configure application fees, exam fees, late fees, and special charges per exam and category."
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Fee Configuration
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Fee Type</th>
                <th className="px-4 py-3 font-semibold">Exam</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold text-right">Amount (₹)</th>
                <th className="px-4 py-3 font-semibold text-right">Tax (%)</th>
                <th className="px-4 py-3 font-semibold text-right">Total (₹)</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_FEES.map(fee => {
                const total = fee.amount + (fee.amount * fee.taxPercent / 100);
                return (
                  <tr key={fee.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">{fee.feeType}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{fee.exam}</td>
                    <td className="px-4 py-3">{fee.category}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {fee.amount === 0 ? <span className="text-emerald-600">Free</span> : `₹${fee.amount}`}
                    </td>
                    <td className="px-4 py-3 text-right">{fee.taxPercent}%</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">₹{total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        {fee.isActive
                          ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"><ToggleRight className="w-3.5 h-3.5" /> Active</span>
                          : <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded"><ToggleLeft className="w-3.5 h-3.5" /> Inactive</span>
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
