import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { CertificateTemplate } from '../types';
import { BadgeCheck, LayoutTemplate } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface CertificateTemplateCardProps {
  template: CertificateTemplate;
  onSelect?: () => void;
  selected?: boolean;
}

export function CertificateTemplateCard({ template, onSelect, selected = false }: CertificateTemplateCardProps) {
  return (
    <Card className={`border overflow-hidden transition-all cursor-pointer ${selected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200 shadow-sm hover:border-indigo-300'}`} onClick={onSelect}>
       <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden group">
          <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Button variant="secondary" size="sm" className="bg-white text-slate-900 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); onSelect && onSelect(); }}>
                <LayoutTemplate className="w-4 h-4 mr-2" /> Select Template
             </Button>
          </div>
          {template.isDefault && (
            <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
               Default
            </div>
          )}
       </div>
       <CardContent className="p-4">
          <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            {selected && <BadgeCheck className="w-4 h-4 text-indigo-600" />}
            {template.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{template.type}</p>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{template.description}</p>
       </CardContent>
    </Card>
  );
}
