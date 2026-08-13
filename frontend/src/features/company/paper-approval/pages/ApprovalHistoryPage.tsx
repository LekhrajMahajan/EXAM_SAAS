import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DUMMY_APPROVAL_HISTORY, DUMMY_PAPER_APPROVALS } from '../utils/placeholder';
import { ApprovalTimeline } from '../components/ApprovalTimeline';
import { PaperSummaryCard } from '../components/PaperSummaryCard';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ApprovalHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get('paperId');
  
  const history = paperId 
    ? DUMMY_APPROVAL_HISTORY.filter(h => h.paperId === paperId) 
    : DUMMY_APPROVAL_HISTORY;
    
  const approval = DUMMY_PAPER_APPROVALS.find(r => r.paperId === paperId) || DUMMY_PAPER_APPROVALS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/company/paper-approval">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Approval History</h1>
          <p className="text-slate-500 mt-1">Timeline of all approval actions for this paper.</p>
        </div>
      </div>

      <PaperSummaryCard approval={approval} />
      
      <ApprovalTimeline history={history} />
    </div>
  );
};
