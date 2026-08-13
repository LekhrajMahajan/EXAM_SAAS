import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_CERTIFICATES } from '../utils/placeholder';
import { CertificateSummary } from '../components/CertificateSummary';
import { CertificatePreview } from '../components/CertificatePreview';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export function CertificateDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  // Placeholder: find record by id or default to first
  const record = DUMMY_CERTIFICATES.find(r => r.id === id) || DUMMY_CERTIFICATES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-slate-500 hover:text-slate-900">
          <Link to="/company/certificates/list">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title="Certificate Details" 
          description="View comprehensive details for this generated certificate." 
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
         <CertificateSummary record={record} />
         
         <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Certificate Document Preview</h3>
            <CertificatePreview 
              candidateName={record.candidateName}
              exam={record.exam}
              issueDate={record.issueDate}
            />
         </div>
      </div>
    </div>
  );
}
