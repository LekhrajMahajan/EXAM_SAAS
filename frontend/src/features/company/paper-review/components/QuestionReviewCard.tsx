import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

import type { ReviewQuestion } from '../types';

interface QuestionReviewCardProps {
  question: ReviewQuestion | undefined;
  index: number;
}

export const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({ question, index }) => {
  if (!question) return null;

  return (
    <Card>
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{question.type}</Badge>
            <Badge variant="outline">{question.difficulty}</Badge>
            <Badge variant="secondary">{question.topic}</Badge>
            <span className="text-sm font-semibold ml-2">[{question.marks} Marks]</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose max-w-none">
          <p className="text-slate-800 text-lg font-medium">{question.text}</p>
        </div>
      </CardContent>
    </Card>
  );
};
