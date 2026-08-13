import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { CertificateRecord } from '../types';
import { Award, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatusBadge } from './StatusBadge';

interface CertificateCardProps {
  certificate: CertificateRecord;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
      <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">{certificate.name}</h4>
            <p className="text-sm text-slate-500 mt-1">Issued on {certificate.issueDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
           <StatusBadge status={certificate.status} />
           {certificate.status === 'Issued' && (
             <Button variant="outline">
               <Download className="w-4 h-4 mr-2" />
               Download
             </Button>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
