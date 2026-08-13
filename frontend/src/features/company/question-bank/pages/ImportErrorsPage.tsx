import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ErrorTable } from '../components/ErrorTable';
import type { QuestionRow } from '../schemas/import-schemas';

const MOCK_ERRORS: QuestionRow[] = [
  { id: '', questionText: 'What is 2+2?', subject: '', topic: 'Basic Math', difficulty: 'Easy', marks: -1, questionType: 'Multiple Choice', language: 'English', validationStatus: 'invalid', errors: ['Subject is required', 'Marks must be greater than 0'] },
  { id: '', questionText: '', subject: 'History', topic: 'World War 2', difficulty: 'Medium', marks: 5, questionType: 'Multiple Choice', language: 'English', validationStatus: 'invalid', errors: ['Question text is required'] },
];

export function ImportErrorsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Import Errors" 
        description="Resolve validation errors in your uploaded file." 
      />
      <ErrorTable errors={MOCK_ERRORS} />
    </div>
  );
}
