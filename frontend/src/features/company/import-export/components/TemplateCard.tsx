import React from 'react';
import type { TemplateConfig } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function TemplateCard({ template }: { template: TemplateConfig }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
       <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">{template.format}</span>
          </div>
          
          <h3 className="font-bold text-slate-900 text-lg mb-2">{template.name}</h3>
          <p className="text-sm text-slate-600 mb-4 flex-1">{template.description}</p>
          
          <div className="mb-4">
             <p className="text-xs font-bold text-slate-700 mb-2">Required Fields:</p>
             <div className="flex flex-wrap gap-1">
                {template.requiredFields.map(field => (
                   <span key={field} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{field}</span>
                ))}
             </div>
          </div>
          
          <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
             <Download className="w-4 h-4 mr-2" /> Download Template
          </Button>
       </CardContent>
    </Card>
  );
}
