import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { QuestionForm } from '../components/QuestionForm';

export function CreateQuestionPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Create New Question" 
        description="Add a new question to the question bank." 
      />
      <QuestionForm />
    </div>
  );
}
