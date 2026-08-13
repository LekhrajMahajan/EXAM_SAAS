import React, { useState } from 'react';
import { PaperSummaryCard } from './PaperSummaryCard';
import { QuestionNavigator } from './QuestionNavigator';
import { QuestionReviewCard } from './QuestionReviewCard';
import { ReviewChecklist } from './ReviewChecklist';
import { DecisionPanel } from './DecisionPanel';
import { Validation } from './Validation';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reviewChecklistSchema, reviewDecisionSchema } from '../schemas/paper-review-schemas';
import type { PaperReview, ReviewQuestion } from '../types';

interface ReviewWorkspaceProps {
  review: PaperReview;
  questions: ReviewQuestion[];
}

const workspaceFormSchema = z.object({
  checklist: reviewChecklistSchema,
  decision: reviewDecisionSchema,
});

export const ReviewWorkspace: React.FC<ReviewWorkspaceProps> = ({ review, questions }) => {
  const [activeQuestionId, setActiveQuestionId] = useState(questions[0]?.id);

  const form = useForm<z.infer<typeof workspaceFormSchema>>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      checklist: {
        questionQuality: false,
        grammar: false,
        spelling: false,
        correctAnswer: false,
        duplicateQuestions: false,
        difficultyBalance: false,
        marksDistribution: false,
        blueprintValidation: false,
        languageReview: false,
        formatting: false,
      },
      decision: {
        decision: 'Approve for Approval',
        comments: '',
        internalNotes: '',
      }
    }
  });

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  const onSubmit = (_data: z.infer<typeof workspaceFormSchema>) => {
    // Handle submission
  };

  const checklistValues = useWatch({ control: form.control, name: 'checklist' });
  const decisionValue = useWatch({ control: form.control, name: 'decision.decision' });

  const validations = [
    { id: '1', rule: 'All questions reviewed', passed: true },
    { id: '2', rule: 'Checklist completed', passed: Object.values(checklistValues).every(Boolean) },
    { id: '3', rule: 'Decision selected', passed: !!decisionValue },
  ];

  return (
    <div className="space-y-6">
      <PaperSummaryCard review={review} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            activeQuestionId={activeQuestionId}
            onSelect={setActiveQuestionId}
          />
        </div>
        <div className="lg:col-span-3">
          <QuestionReviewCard question={activeQuestion} index={questions.findIndex(q => q.id === activeQuestionId)} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ReviewChecklist />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <DecisionPanel />
            </div>
            <div className="lg:col-span-1">
              <Validation validations={validations} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">Save Draft</Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
