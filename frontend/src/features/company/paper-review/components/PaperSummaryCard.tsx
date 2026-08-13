import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { PaperReview } from '../types';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { Calendar, User, BookOpen, Layers } from 'lucide-react';

interface PaperSummaryCardProps {
  review: PaperReview;
}

export const PaperSummaryCard: React.FC<PaperSummaryCardProps> = ({ review }) => {
  return (
    <Card>
      <CardHeader className="bg-slate-50 border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{review.paperName}</CardTitle>
            <div className="text-sm text-slate-500 font-medium">Code: {review.paperCode}</div>
          </div>
          <div className="flex gap-2">
            <Badge variant={review.priority === 'High' ? 'destructive' : review.priority === 'Medium' ? 'default' : 'secondary'}>
              {review.priority} Priority
            </Badge>
            <ReviewStatusBadge status={review.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Subject</div>
              <div className="font-semibold text-slate-800">{review.subject}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Reviewer</div>
              <div className="font-semibold text-slate-800">{review.reviewerName}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Layers className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Size</div>
              <div className="font-semibold text-slate-800">{review.totalQuestions} Qs / {review.totalMarks} Mks</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Timeline</div>
              <div className="font-semibold text-slate-800">
                {review.assignedDate} {review.dueDate ? `- ${review.dueDate}` : ''}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
