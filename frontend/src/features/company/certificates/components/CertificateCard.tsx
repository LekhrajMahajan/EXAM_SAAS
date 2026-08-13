import React from 'react';
import type { CertificateRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { User, Award, ShieldCheck, DownloadCloud } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

interface CertificateCardProps {
  record: CertificateRecord;
}

export function CertificateCard({ record }: CertificateCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full flex items-top justify-end pr-2 pt-2 z-0">
        <Award className="w-6 h-6 text-indigo-200" />
      </div>
      <CardContent className="p-5 relative z-10">
        <div className="mb-4 pb-4 border-b border-slate-100">
           <p className="text-xs font-mono text-slate-500 mb-1">{record.certificateNumber}</p>
           <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
             <User className="w-4 h-4 text-slate-400" />
             {record.candidateName}
           </h4>
        </div>
        
        <div className="space-y-2 mb-6 text-sm">
           <div className="flex justify-between">
             <span className="text-slate-500">Type</span>
             <span className="font-medium text-slate-900">{record.certificateType}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-500">Issue Date</span>
             <span className="font-medium text-slate-900">{record.issueDate}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-500">Verification</span>
             <span className="font-medium text-emerald-600 flex items-center gap-1">
               {record.verificationStatus === 'Verified' ? <><ShieldCheck className="w-3 h-3"/> Verified</> : record.verificationStatus}
             </span>
           </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link to={`/company/certificates/${record.id}`}>Details</Link>
          </Button>
          <Button variant="outline" className="w-full text-sm text-indigo-600 border-indigo-200 hover:bg-indigo-50">
            <DownloadCloud className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
