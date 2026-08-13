import React from 'react';
import type { CertificateRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { DownloadCloud, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface CertificateSummaryProps {
  record: CertificateRecord;
}

export function CertificateSummary({ record }: CertificateSummaryProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{record.candidateName}</h3>
            <p className="text-sm font-mono text-slate-500">{record.applicationNumber}</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="bg-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Public Link
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <DownloadCloud className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
         </div>
      </div>
      <CardContent className="p-6">
         <h4 className="font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Certificate Meta</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Certificate No.</p>
              <p className="font-mono text-slate-900 font-semibold">{record.certificateNumber}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Exam</p>
              <p className="text-sm font-medium text-slate-900">{record.exam}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Date</p>
              <p className="text-sm font-medium text-slate-900">{record.issueDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Verification Status</p>
              <p className="text-sm font-medium text-slate-900">{record.verificationStatus}</p>
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
