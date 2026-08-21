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
    <Card className={`border overflow-hidden transition-all cursor-pointer ${selected ? 'border-primary ring-1 ring-primary shadow-md bg-primary/5' : 'border-border shadow-sm hover:border-primary/50'}`} onClick={onSelect}>
       <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 transition-transform group-hover:scale-105 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-lg font-bold text-primary/60">{template.name}</span>
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Button variant="secondary" size="sm" className="bg-card text-foreground hover:bg-muted" onClick={(e) => { e.stopPropagation(); onSelect?.(); }}>
                <LayoutTemplate className="w-4 h-4 mr-2" /> Select Template
             </Button>
          </div>
          {template.isDefault && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
               Default
            </div>
          )}
       </div>
       <CardContent className="p-4">
          <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
            {selected && <BadgeCheck className="w-4 h-4 text-primary" />}
            {template.name}
          </h4>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{template.type}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{template.description}</p>
       </CardContent>
    </Card>
  );
}
