import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ProfileCard } from '../components/ProfileCard';
import { DUMMY_CANDIDATE_PROFILE } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Edit } from 'lucide-react';

export function CandidateProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="My Profile" 
          description="Manage your personal information and contact details." 
        />
        <Button variant="outline" className="bg-white">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <ProfileCard profile={DUMMY_CANDIDATE_PROFILE} />
    </div>
  );
}
