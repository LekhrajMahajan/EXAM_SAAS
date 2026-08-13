import React from 'react';
import type { FileRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { HardDrive, Cloud } from 'lucide-react';
import { DUMMY_FILE_STATS } from '../utils/placeholder';

export function StorageCard() {
  const stats = DUMMY_FILE_STATS;
  const categories = [
    { label: 'PDFs', value: stats.pdfs, color: 'bg-red-400', percent: Math.round((stats.pdfs / stats.totalFiles) * 100) },
    { label: 'Images', value: stats.images, color: 'bg-sky-400', percent: Math.round((stats.images / stats.totalFiles) * 100) },
    { label: 'Documents', value: stats.documents, color: 'bg-emerald-400', percent: Math.round((stats.documents / stats.totalFiles) * 100) },
  ];

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Storage Overview</h3>
            <p className="text-xs text-slate-500">Local / Cloud Provider</p>
          </div>
        </div>

        <div className="flex h-4 rounded-full overflow-hidden mb-4 gap-0.5">
          {categories.map(cat => (
            <div key={cat.label} className={`${cat.color} transition-all`} style={{ width: `${cat.percent}%` }} title={cat.label}></div>
          ))}
          <div className="bg-slate-200 flex-1"></div>
        </div>

        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></div>
                <span className="text-slate-600 font-medium">{cat.label}</span>
              </div>
              <span className="font-bold text-slate-900">{cat.value.toLocaleString()} <span className="text-slate-400 font-normal">({cat.percent}%)</span></span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Cloud className="w-4 h-4" />
            <span>Provider</span>
          </div>
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">Local Storage</span>
        </div>
      </CardContent>
    </Card>
  );
}
