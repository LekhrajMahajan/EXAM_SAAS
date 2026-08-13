import React from 'react';
import type { FieldMapping } from '../types';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function MappingTable({ mappings }: { mappings: FieldMapping[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
         <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-slate-900">Source:</span> <span className="font-mono text-slate-600 bg-white px-2 py-1 border border-slate-200 rounded">candidates.csv</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-900">Destination:</span> <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">Candidates Module</span>
         </div>
         <Button variant="outline" size="sm">Auto-Map Fields</Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Source Field (CSV)</th>
              <th scope="col" className="px-4 py-3 font-semibold w-12 text-center"></th>
              <th scope="col" className="px-4 py-3 font-semibold">Destination Field (System)</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                   <div className="font-mono text-sm font-bold text-slate-700">{mapping.sourceField}</div>
                </td>
                <td className="px-4 py-3 text-center">
                   <ArrowRight className="w-4 h-4 text-slate-300 inline-block" />
                </td>
                <td className="px-4 py-3">
                   <select className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" defaultValue={mapping.destinationField}>
                      <option value="">-- Ignore Field --</option>
                      <option value="firstName">First Name</option>
                      <option value="lastName">Last Name</option>
                      <option value="email">Email Address</option>
                      <option value="phone">Phone Number</option>
                      <option value="dateOfBirth">Date of Birth</option>
                   </select>
                   {mapping.isRequired && !mapping.destinationField && (
                     <div className="flex items-center gap-1 text-[10px] text-red-500 mt-1 font-bold">
                        <AlertCircle className="w-3 h-3" /> Required Field Missing
                     </div>
                   )}
                </td>
                <td className="px-4 py-3 text-center">
                   {mapping.destinationField ? (
                     <span className="flex items-center justify-center text-emerald-500" title="Mapped"><CheckCircle2 className="w-5 h-5" /></span>
                   ) : (
                     <span className="flex items-center justify-center text-slate-300" title="Ignored"><CheckCircle2 className="w-5 h-5" /></span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
