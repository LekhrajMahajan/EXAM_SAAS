import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateResultSchema, type GenerateResultForm } from '../schemas/result-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { examApi, type Exam } from '@/features/exam-manager/api/exam.api';
import { apiClient } from '@/core/api/http/axios-client';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function GenerateResultsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<GenerateResultForm>({
    resolver: zodResolver(generateResultSchema),
  });

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoadingExams(true);
      try {
        const response = await examApi.getAll({ limit: 100 });
        setExams(response.data?.exams || []);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
        toast.error('Failed to load exams.');
      } finally {
        setIsLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  const onSubmit = async (data: GenerateResultForm) => {
    setIsGenerating(true);
    try {
      // Call backend to generate results
      const response = await apiClient.post('/results/generate', {
        examId: data.exam,
        negativeMarking: true, // evaluate negative marks automatically
      });
      
      if (response.data?.data?.generated === false) {
        toast.error(response.data?.data?.message || 'No submitted candidates found for evaluation.');
        return;
      }
      
      toast.success('Results generated successfully!');
      navigate('/company/results');
    } catch (error: any) {
      console.error('Failed to generate results:', error);
      toast.error(error.response?.data?.message || 'Failed to generate results.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Generate Results" 
        description="Process submitted answer scripts and compute scores based on evaluation criteria." 
      />

      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="bg-muted/50 border-b border-border">
          <CardTitle className="text-lg">Generate result</CardTitle>
          <CardDescription>Select the exam batch to evaluate.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Exam <span className="text-red-500">*</span></label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('exam')}
                  disabled={isLoadingExams}
                >
                  <option value="">{isLoadingExams ? 'Loading exams...' : 'Select Exam'}</option>
                  {exams.map(ex => <option key={ex._id} value={ex._id}>{ex.examTitle} ({ex.examCode})</option>)}
                </select>
                {errors.exam && <p className="text-xs text-red-500">{errors.exam.message}</p>}
              </div>

            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" disabled={isGenerating}>
                {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Generate result
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
