import React from 'react';
import type { CertificateRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ShieldCheck, ShieldAlert, Key, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VerificationCardProps {
  record: CertificateRecord | null;
}

export function VerificationCard({ record }: VerificationCardProps) {
  if (!record) {
    return (
      <Card className="border-slate-200 shadow-sm border-dashed bg-slate-50/50">
        <CardContent className="p-12 text-center">
           <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-medium">Enter a certificate number above or scan a QR code to verify authenticity.</p>
        </CardContent>
      </Card>
    );
  }

  const isVerified = record.verificationStatus === 'Verified';

  return (
    <Card className={cn("border shadow-sm overflow-hidden", isVerified ? "border-emerald-200" : "border-red-200")}>
       <div className={cn("p-6 text-white flex items-center justify-center gap-3", isVerified ? "bg-emerald-600" : "bg-red-600")}>
          {isVerified ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          <h2 className="text-2xl font-bold">{isVerified ? 'Authentic Certificate' : 'Verification Failed'}</h2>
       </div>
       <CardContent className="p-8">
          {isVerified ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-100 flex items-start gap-3">
                 <Key className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="font-bold text-sm">Cryptographic Signature Valid</p>
                   <p className="text-xs mt-1">This certificate was digitally signed by the examination authority and has not been tampered with.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Candidate Name</p>
                   <p className="text-lg font-semibold text-slate-900">{record.candidateName}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Certificate Number</p>
                   <p className="text-lg font-mono text-slate-900">{record.certificateNumber}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Examination</p>
                   <p className="text-base font-medium text-slate-800">{record.exam}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Date</p>
                   <p className="text-base font-medium text-slate-800 flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     {record.issueDate}
                   </p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 flex items-start gap-3">
                 <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="font-bold text-sm">Authentication Error</p>
                   <p className="text-xs mt-1">{record.remarks || 'The cryptographic signature is invalid or the certificate has been revoked.'}</p>
                 </div>
              </div>
              <p className="text-sm text-slate-600 text-center">Please contact support or the issuing authority for further assistance.</p>
            </div>
          )}
       </CardContent>
    </Card>
  );
}
