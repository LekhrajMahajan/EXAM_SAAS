import React from 'react';
import type { ExamMaterial } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { FileText, ScanLine, BookOpen, Scroll } from 'lucide-react';

const MATERIAL_ICONS = {
  'Question Paper': FileText,
  'OMR Sheet': ScanLine,
  'Answer Booklet': BookOpen,
  'Rough Sheet': Scroll,
};

export function MaterialCard({ material }: { material: ExamMaterial }) {
  const Icon = MATERIAL_ICONS[material.materialType] ?? FileText;
  const distributionPct = material.totalQuantity > 0 ? Math.round((material.distributedQuantity / material.totalQuantity) * 100) : 0;
  const returnPct = material.distributedQuantity > 0 ? Math.round((material.returnedQuantity / material.distributedQuantity) * 100) : 0;

  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">{material.materialType}</div>
              <div className="text-xs text-slate-500">Total: {material.totalQuantity}</div>
            </div>
          </div>
          <StatusBadge status={material.status} />
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">Distributed</span>
              <span className="font-bold text-slate-900">{material.distributedQuantity} ({distributionPct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-1.5 bg-sky-500 rounded-full" style={{ width: `${distributionPct}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">Returned</span>
              <span className="font-bold text-slate-900">{material.returnedQuantity} ({returnPct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${returnPct}%` }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
