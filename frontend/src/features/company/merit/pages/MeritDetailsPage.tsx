import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_MERIT_RECORDS } from '../utils/placeholder';
import { CandidateRankCard } from '../components/CandidateRankCard';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export function MeritDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  // Placeholder: find record by id or default to first
  const record = DUMMY_MERIT_RECORDS.find(r => r.id === id) || DUMMY_MERIT_RECORDS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-slate-500 hover:text-slate-900">
          <Link to="/company/merit/list">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title="Merit & Rank Details" 
          description={`Viewing comprehensive rank profile for ${record.candidateName} (${record.applicationNumber})`} 
        />
      </div>

      <div className="max-w-4xl mx-auto">
         <CandidateRankCard record={record} />
      </div>
    </div>
  );
}
