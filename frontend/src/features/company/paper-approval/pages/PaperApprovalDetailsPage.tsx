import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_PAPER_APPROVALS } from '../utils/placeholder';
import { PaperSummaryCard } from '../components/PaperSummaryCard';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, History, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const PaperApprovalDetailsPage: React.FC = () => {
  const { id } = useParams();
  const approval = DUMMY_PAPER_APPROVALS.find(r => r.id === id) || DUMMY_PAPER_APPROVALS[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/company/paper-approval">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Approval Details</h1>
            <p className="text-slate-500 mt-1">View details and instructions for this approval task.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/company/paper-approval/history?paperId=${approval.paperId}`}>
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
          </Link>
          <Link to={`/company/paper-approval/${approval.id}/approve`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ShieldCheck className="h-4 w-4 mr-2" />
              {approval.approvalStatus === 'Pending' ? 'Start Approval' : 'Continue Approval'}
            </Button>
          </Link>
        </div>
      </div>

      <PaperSummaryCard approval={approval} />

      <Card>
        <CardHeader>
          <CardTitle>Approval Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-slate-700">
            <p>As the final approver, you are responsible for ensuring that the paper is fully compliant and ready for publication. Please review the paper against the following criteria:</p>
            <ul>
              <li>Confirm that the total number of questions and marks exactly matches the syllabus blueprint.</li>
              <li>Ensure that the reviewer has signed off on the questions&apos; correctness and difficulty.</li>
              <li>Verify that the language is appropriate and the formatting is consistent.</li>
              <li>Check that the instructions provided for the students are clear and unambiguous.</li>
            </ul>
            <p>Use the provided Digital Signature to finalize your decision. Once Approved and Locked, the paper version cannot be altered.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
