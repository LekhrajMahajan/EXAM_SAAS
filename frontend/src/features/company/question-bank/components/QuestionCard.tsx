import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Question } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{question.subject}</span>
            <span>&bull;</span>
            <span>{question.topic}</span>
          </div>
          <Badge variant="secondary">{question.questionType}</Badge>
        </div>
        
        <div 
          className="text-base font-medium line-clamp-2"
          dangerouslySetInnerHTML={{ __html: question.questionText }}
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <DifficultyBadge level={question.difficulty} />
            <span className="text-sm text-muted-foreground">
              {question.marks} Marks | -{question.negativeMarks} Negative
            </span>
          </div>
          
          <Badge 
            variant={
              question.status === 'Approved' ? 'default' : 
              question.status === 'Pending Review' ? 'secondary' : 
              question.status === 'Rejected' ? 'destructive' : 'outline'
            }
          >
            {question.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
