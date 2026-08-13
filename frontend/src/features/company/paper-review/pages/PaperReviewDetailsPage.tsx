import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_PAPER_REVIEWS } from '../utils/placeholder';
import { PaperSummaryCard } from '../components/PaperSummaryCard';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Play, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const PaperReviewDetailsPage: React.FC = () => {
  const { id } = useParams();
  const review = DUMMY_PAPER_REVIEWS.find(r => r.id === id) || DUMMY_PAPER_REVIEWS[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/company/paper-review">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Review Details</h1>
            <p className="text-slate-500 mt-1">View details and instructions for this review task.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/company/paper-review/history?paperId=${review.paperId}`}>
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
          </Link>
          <Link to={`/company/paper-review/${review.id}/review`}>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              {review.status === 'Pending' ? 'Start Review' : 'Continue Review'}
            </Button>
          </Link>
        </div>
      </div>

      <PaperSummaryCard review={review} />

      <Card>
        <CardHeader>
          <CardTitle>Review Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-slate-700">
            <p>Please review the paper thoroughly against the provided checklist. Pay special attention to:</p>
            <ul>
              <li>Correctness of the provided answers</li>
              <li>Appropriate difficulty level for the intended audience</li>
              <li>Clarity and lack of ambiguity in the question text</li>
              <li>Alignment with the required syllabus and exam blueprint</li>
            </ul>
            <p>If you find any issues, please detail them in the comments section and return the paper to the setter.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
