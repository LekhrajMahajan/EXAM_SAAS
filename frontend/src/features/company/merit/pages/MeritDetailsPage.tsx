import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useParams, Link } from 'react-router-dom';
import { useMeritLists } from '../hooks/merit.hooks';
import { CandidateRankCard } from '../components/CandidateRankCard';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export function MeritDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMeritLists();
  
  const records = data?.data || [];
  const record = records.find((r: any) => r.id === id) || records[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/company/merit/list">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <PageHeader title="Merit & Rank Details" description="Loading..." />
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/company/merit/list">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <PageHeader title="Merit & Rank Details" description="Record not found." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
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
