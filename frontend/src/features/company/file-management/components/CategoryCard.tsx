import React from 'react';
import type { CategoryRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tag, Files } from 'lucide-react';

export function CategoryCard({ category }: { category: CategoryRecord }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{category.module}</span>
        </div>

        <h3 className="font-bold text-slate-900 text-lg mb-2">{category.name}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{category.description}</p>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Files</span>
            <span className="font-bold text-slate-900 flex items-center gap-1"><Files className="w-3.5 h-3.5 text-slate-400" /> {category.fileCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Allowed Types</span>
            <div className="flex gap-1">
              {category.allowedTypes.map(t => (
                <span key={t} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">{t}</span>
              ))}
            </div>
          </div>
          {category.retentionDays !== undefined && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Retention</span>
              <span className="font-bold text-slate-900">{category.retentionDays} days</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
