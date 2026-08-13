import React from 'react';
import type { FileVersion } from '../types';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function VersionTable({ versions }: { versions: FileVersion[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Version</th>
              <th scope="col" className="px-4 py-3 font-semibold">Uploaded By</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 font-semibold">Size</th>
              <th scope="col" className="px-4 py-3 font-semibold">Change Note</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v, i) => (
              <tr key={v.id} className={`border-b border-slate-100 hover:bg-slate-50/50 ${i === 0 ? 'bg-indigo-50/30' : ''}`}>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    v{v.version} {i === 0 && '(Latest)'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{v.uploadedBy}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(v.uploadedAt).toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{v.size}</td>
                <td className="px-4 py-3 text-slate-600">{v.changeNote ?? <span className="text-slate-400 italic">No notes</span>}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {i > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore
                    </Button>
                  )}
                  {i === 0 && <span className="text-xs text-slate-400 italic pr-2">Current</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
