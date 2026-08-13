import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ImportPreviewTable } from '../components/ImportPreviewTable';
import type { QuestionRow } from '../schemas/import-schemas';

const MOCK_QUESTIONS: QuestionRow[] = [
  { id: '1', questionText: 'What is the capital of France?', subject: 'Geography', topic: 'Capitals', difficulty: 'Easy', marks: 1, questionType: 'Multiple Choice', language: 'English', validationStatus: 'valid' },
  { id: '2', questionText: 'Describe the theory of relativity.', subject: 'Physics', topic: 'Modern Physics', difficulty: 'Hard', marks: 10, questionType: 'Subjective', language: 'English', validationStatus: 'valid' },
  { id: '3', questionText: 'Is the earth flat?', subject: 'Science', topic: 'Astronomy', difficulty: 'Easy', marks: 1, questionType: 'True/False', language: 'English', validationStatus: 'valid' },
];

export function ImportPreviewPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Import Preview" 
        description="Review the questions parsed from your uploaded file before importing." 
      />
      <ImportPreviewTable data={MOCK_QUESTIONS} />
    </div>
  );
}
