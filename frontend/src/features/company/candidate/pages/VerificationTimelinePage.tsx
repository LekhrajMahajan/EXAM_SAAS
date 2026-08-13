import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { VerificationTimeline, type TimelineEvent } from '../components/VerificationTimeline';

const PLACEHOLDER_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    type: 'UPLOADED',
    title: 'Documents Uploaded',
    description: 'Candidate uploaded initial set of 5 documents.',
    date: 'Oct 1, 2023, 10:15 AM',
    user: 'Rahul Sharma (Candidate)',
  },
  {
    id: '2',
    type: 'STARTED',
    title: 'Verification Started',
    description: 'Document verification process initiated by admin.',
    date: 'Oct 2, 2023, 09:00 AM',
    user: 'Admin User',
  },
  {
    id: '3',
    type: 'APPROVED',
    title: 'Passport Photo Approved',
    description: 'Passport size photo was verified and approved.',
    date: 'Oct 2, 2023, 09:05 AM',
    user: 'Admin User',
  },
  {
    id: '4',
    type: 'REJECTED',
    title: 'Aadhaar Card Rejected',
    description: 'Aadhaar Card was rejected. Reason: Blurry image.',
    date: 'Oct 2, 2023, 09:10 AM',
    user: 'Super Admin',
  },
  {
    id: '5',
    type: 'REUPLOAD_REQUESTED',
    title: 'Re-upload Requested',
    description: 'Requested candidate to re-upload clear Aadhaar Card.',
    date: 'Oct 2, 2023, 09:15 AM',
    user: 'Super Admin',
  },
  {
    id: '6',
    type: 'UPLOADED',
    title: 'Document Re-uploaded',
    description: 'Candidate re-uploaded Aadhaar Card.',
    date: 'Oct 3, 2023, 11:30 AM',
    user: 'Rahul Sharma (Candidate)',
  },
  {
    id: '7',
    type: 'APPROVED',
    title: 'Aadhaar Card Approved',
    description: 'Re-uploaded Aadhaar Card was verified and approved.',
    date: 'Oct 4, 2023, 10:00 AM',
    user: 'Admin User',
  },
  {
    id: '8',
    type: 'FINAL_APPROVAL',
    title: 'Final Approval',
    description: 'All documents verified successfully. Candidate marked as verified.',
    date: 'Oct 4, 2023, 10:30 AM',
    user: 'Super Admin',
  }
];

export function VerificationTimelinePage() {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/company/candidates/${id}/verification`}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verification Timeline</h1>
          <p className="text-sm text-gray-500">History of the document verification process.</p>
        </div>
      </div>

      <VerificationTimeline events={PLACEHOLDER_EVENTS} />
    </div>
  );
}
