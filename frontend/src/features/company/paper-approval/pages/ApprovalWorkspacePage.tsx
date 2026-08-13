import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_PAPER_APPROVALS, DUMMY_APPROVAL_QUESTIONS } from '../utils/placeholder';
import { ApprovalWorkspace } from '../components/ApprovalWorkspace';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ApprovalWorkspacePage: React.FC = () => {
  const { id } = useParams();
  const approval = DUMMY_PAPER_APPROVALS.find(r => r.id === id) || DUMMY_PAPER_APPROVALS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/company/paper-approval/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Approval Workspace</h1>
          <p className="text-slate-500 mt-1">Reviewing and approving {approval.paperName}</p>
        </div>
      </div>

      <ApprovalWorkspace approval={approval} questions={DUMMY_APPROVAL_QUESTIONS} />
    </div>
  );
};
