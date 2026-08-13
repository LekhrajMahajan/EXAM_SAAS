import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_PAPER_REVIEWS, DUMMY_QUESTIONS } from '../utils/placeholder';
import { ReviewWorkspace } from '../components/ReviewWorkspace';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ReviewWorkspacePage: React.FC = () => {
  const { id } = useParams();
  const review = DUMMY_PAPER_REVIEWS.find(r => r.id === id) || DUMMY_PAPER_REVIEWS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/company/paper-review/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Review Workspace</h1>
          <p className="text-slate-500 mt-1">Reviewing {review.paperName}</p>
        </div>
      </div>

      <ReviewWorkspace review={review} questions={DUMMY_QUESTIONS} />
    </div>
  );
};
