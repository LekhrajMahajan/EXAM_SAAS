import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { MOCK_QUESTIONS } from '../utils/mockData';
import { QuestionPreview } from '../components/QuestionPreview';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function QuestionPreviewPage() {
  const navigate = useNavigate();
  // For demo, just showing the first question
  const question = MOCK_QUESTIONS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader 
          title="Question Preview" 
          description="View the question exactly as it will appear in an exam." 
        />
      </div>

      <div className="bg-gray-100 p-8 rounded-lg min-h-[60vh] flex items-center justify-center">
        <QuestionPreview question={question} />
      </div>
    </div>
  );
}
