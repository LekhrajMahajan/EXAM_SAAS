import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { questionSchema, type QuestionFormData } from '../schemas/questionSchema';
import { QuestionEditor } from './QuestionEditor';
import { useCreateQuestion, useUpdateQuestion } from '../hooks/question.hooks';

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  isEditing?: boolean;
  questionId?: string;
}

export function QuestionForm({ initialData, isEditing = false, questionId }: QuestionFormProps) {
  const navigate = useNavigate();

  const defaultValues: QuestionFormData = {
    subject: initialData?.subject || '',
    topic: initialData?.topic || '',
    chapter: initialData?.chapter || '',
    questionType: initialData?.questionType || 'Single Choice (MCQ)',
    difficulty: initialData?.difficulty || 'Medium',
    language: initialData?.language || 'English',
    questionText: initialData?.questionText || '',
    options: initialData?.options ?? [
      { id: crypto.randomUUID(), text: '', isCorrect: false, order: 1 },
      { id: crypto.randomUUID(), text: '', isCorrect: false, order: 2 },
      { id: crypto.randomUUID(), text: '', isCorrect: false, order: 3 },
      { id: crypto.randomUUID(), text: '', isCorrect: false, order: 4 },
    ],
    explanation: initialData?.explanation || '',
    marks: initialData?.marks ?? 1,
    negativeMarks: initialData?.negativeMarks ?? 0,
    timeLimitSeconds: initialData?.timeLimitSeconds ?? 60,
    metadata: {
      keywords: initialData?.metadata?.keywords ?? [],
      tags: initialData?.metadata?.tags ?? [],
      bloomsLevel: initialData?.metadata?.bloomsLevel ?? '',
      cognitiveLevel: initialData?.metadata?.cognitiveLevel ?? '',
    },
    status: initialData?.status || 'Draft',
  };

  const methods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion(questionId || '');
  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: QuestionFormData) => {
    try {
      if (isEditing && questionId) {
        await updateQuestion.mutateAsync(data);
      } else {
        await createQuestion.mutateAsync(data);
      }
      navigate('/company/question-bank');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <QuestionEditor />

        {/* Actions - Sticky Footer */}
        <div className="flex items-center justify-end gap-4 bg-gray-50 p-4 border-t sticky bottom-0 z-10 rounded-md mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/company/question-bank')} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Question' : 'Save Question'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
