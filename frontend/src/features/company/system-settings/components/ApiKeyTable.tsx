import React from 'react';
import type { ApiKey } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Trash2, Copy, EyeOff } from 'lucide-react';

interface ApiKeyTableProps {
  keys: ApiKey[];
}

export function ApiKeyTable({ keys }: ApiKeyTableProps) {
  
  if (keys.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No API keys found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">Key Name</th>
              <th scope="col" className="px-6 py-4">Prefix</th>
              <th scope="col" className="px-6 py-4">Created</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                   {key.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs flex items-center gap-2">
                   {key.prefix} <EyeOff className="w-3 h-3 text-slate-400" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {key.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${key.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : key.status === 'Expired' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                     {key.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                     <Button variant="ghost" size="sm" className="text-slate-500">
                       <Copy className="w-4 h-4" />
                     </Button>
                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                       <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
