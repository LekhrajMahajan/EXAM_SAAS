import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_CERTIFICATES } from '../utils/placeholder';
import { CertificateCard } from '../components/CertificateCard';

export function CandidateCertificatesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="My Certificates" 
        description="Download your digital certificates and qualifications." 
      />

      <div className="grid gap-4">
        {DUMMY_CERTIFICATES.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
        {DUMMY_CERTIFICATES.length === 0 && (
           <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
              <p className="text-slate-500">You don't have any certificates issued yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
