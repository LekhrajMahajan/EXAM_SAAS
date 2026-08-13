import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Edit, Loader2 } from 'lucide-react';
import { QuestionPreview } from '../components/QuestionPreview';
import { useQuestionDetail } from '../hooks/question.hooks';
import type { Question } from '../types';

export function QuestionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useQuestionDetail(id || '');

  const question = data?.data as Question | undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="p-6 text-center text-red-500">
        Question not found or failed to load.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title={`Question: ${question.id}`} 
          description={`${question.subject} - ${question.topic}`} 
        />
        <Button onClick={() => navigate(`/company/question-bank/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" /> Edit Question
        </Button>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="preview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3">
            Preview
          </TabsTrigger>
          <TabsTrigger value="metadata" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3">
            Metadata
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3">
            Activity Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="pt-6">
          <QuestionPreview question={question} showExplanation={true} />
        </TabsContent>
        
        <TabsContent value="metadata" className="pt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Keywords</div>
                  <div className="font-medium">{question.metadata?.keywords?.join(', ') || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                  <div className="font-medium">{question.metadata?.tags?.join(', ') || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bloom&apos;s Taxonomy Level</div>
                  <div className="font-medium">{question.metadata?.bloomsLevel || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Cognitive Level</div>
                  <div className="font-medium">{question.metadata?.cognitiveLevel || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Created By</div>
                  <div className="font-medium">{question.createdBy} ({new Date(question.createdAt).toLocaleDateString()})</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="font-medium">{new Date(question.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="pt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">Question Approved</p>
                    <p className="text-sm text-muted-foreground">By Reviewer A on {new Date(question.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="font-medium">Question Created</p>
                    <p className="text-sm text-muted-foreground">By {question.createdBy} on {new Date(question.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

