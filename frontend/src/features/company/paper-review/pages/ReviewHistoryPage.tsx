import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DUMMY_REVIEW_HISTORY, DUMMY_PAPER_REVIEWS } from '../utils/placeholder';
import { ReviewTimeline } from '../components/ReviewTimeline';
import { PaperSummaryCard } from '../components/PaperSummaryCard';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ReviewHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get('paperId');
  
  const history = paperId 
    ? DUMMY_REVIEW_HISTORY.filter(h => h.paperId === paperId) 
    : DUMMY_REVIEW_HISTORY;
    
  const review = DUMMY_PAPER_REVIEWS.find(r => r.paperId === paperId) || DUMMY_PAPER_REVIEWS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/company/paper-review">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Review History</h1>
          <p className="text-slate-500 mt-1">Timeline of all review actions for this paper.</p>
        </div>
      </div>

      <PaperSummaryCard review={review} />
      
      <ReviewTimeline history={history} />
    </div>
  );
};
