import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CandidateSearchCard } from '../components/CandidateSearchCard';
import { CandidateInfoCard } from '../components/CandidateInfoCard';
import { VerificationChecklist } from '../components/VerificationChecklist';
import { IdentityCard } from '../components/IdentityCard';
import { DUMMY_VERIFICATIONS } from '../utils/placeholder';
import type { VerificationRecord } from '../types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function CandidateCheckInPage() {
  const [searchParams] = useSearchParams();
  const initialAppNo = searchParams.get('appNo');
  
  const [candidate, setCandidate] = useState<VerificationRecord | null>(
    initialAppNo ? DUMMY_VERIFICATIONS.find(v => v.applicationNumber === initialAppNo) || null : null
  );
  const navigate = useNavigate();

  const handleSearch = (data: any) => {
    // Simulate fetching candidate
    const found = DUMMY_VERIFICATIONS.find(c => 
      data.searchType === 'application' && c.applicationNumber === data.query
    );
    
    if (found) {
      setCandidate(found);
      toast({ title: 'Candidate located in database.', variant: 'success' });
    } else {
      toast({ title: 'Candidate not found or invalid details.', variant: 'destructive' });
    }
  };

  const handleVerificationComplete = (data: any) => {
    if (data.status === 'Verified') {
      toast({ title: 'Candidate verified and allowed entry.', variant: 'success' });
    } else if (data.status === 'Hold') {
      toast({ title: 'Candidate placed on hold.', variant: 'destructive' });
    } else {
      toast({ title: 'Candidate entry rejected.', variant: 'destructive' });
    }
    
    // Simulate navigation back to dashboard after a short delay
    setTimeout(() => {
      navigate('/company/entry-verification');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Check-In Desk" 
        description="Verify candidate identity and grant entry into the examination center." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
          <CandidateSearchCard onSearch={handleSearch} />
          <IdentityCard isActive={!!candidate} />
          <CandidateInfoCard candidate={candidate} />
        </div>
        <div className="lg:col-span-7">
          <VerificationChecklist isActive={!!candidate} onComplete={handleVerificationComplete} />
        </div>
      </div>
    </div>
  );
}
