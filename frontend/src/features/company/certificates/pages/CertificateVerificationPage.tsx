import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCertificateSchema, type VerifyCertificateForm } from '../schemas/certificate-schemas';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, QrCode } from 'lucide-react';
import { VerificationCard } from '../components/VerificationCard';
import { DUMMY_CERTIFICATES } from '../utils/placeholder';
import type { CertificateRecord } from '../types';

export function CertificateVerificationPage() {
  const [verificationResult, setVerificationResult] = useState<CertificateRecord | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyCertificateForm>({
    resolver: zodResolver(verifyCertificateSchema),
  });

  const onSubmit = (data: VerifyCertificateForm) => {
    // Mock lookup
    const found = DUMMY_CERTIFICATES.find(c => c.certificateNumber === data.certificateNumber);
    if (found) {
       setVerificationResult(found);
    } else {
       // Mock failed state
       setVerificationResult({
          id: 'UNKNOWN',
          certificateNumber: data.certificateNumber,
          applicationNumber: 'UNKNOWN',
          candidateName: 'UNKNOWN',
          exam: 'UNKNOWN',
          certificateType: 'UNKNOWN',
          center: 'UNKNOWN',
          issueDate: 'UNKNOWN',
          verificationStatus: 'Failed',
          downloadStatus: 'Not Downloaded',
          remarks: 'No certificate found matching this number.'
       });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Verify Certificate" 
        description="Check the authenticity of an issued certificate using its unique number or QR code." 
      />

      <Card className="border-slate-200 shadow-sm mb-8">
         <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               
               <div>
                  <h3 className="font-bold text-slate-900 mb-2">Manual Verification</h3>
                  <p className="text-sm text-slate-500 mb-4">Enter the certificate number located at the top-right of the document.</p>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <div>
                       <div className="relative w-full">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <Input 
                           placeholder="e.g. CERT-2026-99182" 
                           className="pl-9 font-mono"
                           {...register('certificateNumber')}
                         />
                       </div>
                       {errors.certificateNumber && <p className="text-xs text-red-500 mt-1">{errors.certificateNumber.message}</p>}
                     </div>
                     <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">Verify Now</Button>
                  </form>
               </div>

               <div className="hidden md:flex flex-col items-center justify-center border-l border-slate-200 pl-8">
                  <div className="w-24 h-24 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center mb-4">
                     <QrCode className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Scan QR Code</h3>
                  <p className="text-sm text-slate-500 text-center mb-4">Use a scanner device or webcam to read the QR code on the physical certificate.</p>
                  <Button variant="outline">Activate Scanner</Button>
               </div>

            </div>
         </CardContent>
      </Card>

      <VerificationCard record={verificationResult} />

    </div>
  );
}
