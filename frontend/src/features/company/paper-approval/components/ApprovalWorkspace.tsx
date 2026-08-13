import React from 'react';
import { PaperSummaryCard } from './PaperSummaryCard';
import { VersionCard } from './VersionCard';
import { ApprovalChecklist } from './ApprovalChecklist';
import { DecisionPanel } from './DecisionPanel';
import { Validation } from './Validation';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { approvalChecklistSchema, approvalDecisionSchema } from '../schemas/paper-approval-schemas';
import type { PaperApproval, ApprovalQuestion } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ApprovalWorkspaceProps {
  approval: PaperApproval;
  questions: ApprovalQuestion[];
}

const workspaceFormSchema = z.object({
  checklist: approvalChecklistSchema,
  decision: approvalDecisionSchema,
});

export const ApprovalWorkspace: React.FC<ApprovalWorkspaceProps> = ({ approval, questions }) => {
  const form = useForm<z.infer<typeof workspaceFormSchema>>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      checklist: {
        paperComplete: false,
        questionCountVerified: false,
        marksVerified: false,
        blueprintVerified: false,
        difficultyVerified: false,
        instructionsVerified: false,
        languageVerified: false,
      },
      decision: {
        decision: 'Approve',
        remarks: '',
        signature: '',
        lockPaper: false,
      }
    }
  });

  const onSubmit = (_data: z.infer<typeof workspaceFormSchema>) => {
    // Handle submission
  };

  const checklistValues = useWatch({ control: form.control, name: 'checklist' });
  const decisionValue = useWatch({ control: form.control, name: 'decision.decision' });
  const signatureValue = useWatch({ control: form.control, name: 'decision.signature' });

  const validations = [
    { id: '1', rule: 'Checklist completed', passed: checklistValues ? Object.values(checklistValues).every(Boolean) : false },
    { id: '2', rule: 'Decision selected', passed: !!decisionValue },
    { id: '3', rule: 'Digital signature provided', passed: !!signatureValue && signatureValue.trim().length > 0 },
  ];

  const isLocked = useWatch({ control: form.control, name: 'decision.lockPaper' });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PaperSummaryCard approval={approval} />
        </div>
        <div className="md:col-span-1">
          <VersionCard approval={approval} isLocked={isLocked} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Question Preview Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500">
            Total Questions: {questions.length} | Questions available for preview. (Preview component omitted for brevity, use QuestionNavigator from Review module if needed)
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ApprovalChecklist />
          
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
            <Button type="submit">Submit Final Decision</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
