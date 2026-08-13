import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PaperHeader } from '../components/PaperHeader';
import { PaperPreview } from '../components/PaperPreview';
import { PaperStatistics } from '../components/PaperStatistics';
import { MarksDistribution } from '../components/MarksDistribution';
import { DifficultyDistribution } from '../components/DifficultyDistribution';
import { DUMMY_PAPERS } from '../utils/placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export const PaperDetailsPage: React.FC = () => {
  const { id } = useParams();
  const paper = DUMMY_PAPERS.find(p => p.id === id) || DUMMY_PAPERS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <PaperHeader paper={paper} />
      
      <PaperStatistics />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto md:h-10 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-slate-500">Paper Name</div>
                  <div className="font-medium">{paper.name}</div>
                  
                  <div className="text-slate-500">Paper Code</div>
                  <div className="font-medium">{paper.code}</div>
                  
                  <div className="text-slate-500">Subject</div>
                  <div className="font-medium">{paper.subject}</div>
                  
                  <div className="text-slate-500">Exam Type</div>
                  <div className="font-medium">{paper.examType}</div>
                  
                  <div className="text-slate-500">Language</div>
                  <div className="font-medium">{paper.language}</div>
                  
                  <div className="text-slate-500">Created By</div>
                  <div className="font-medium">{paper.createdBy}</div>
                  
                  <div className="text-slate-500">Created At</div>
                  <div className="font-medium">{new Date(paper.createdAt || '').toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-slate-500">Total Marks</div>
                  <div className="font-medium">{paper.totalMarks}</div>
                  
                  <div className="text-slate-500">Passing Marks</div>
                  <div className="font-medium">{paper.passingMarks}</div>
                  
                  <div className="text-slate-500">Duration</div>
                  <div className="font-medium">{paper.duration} minutes</div>
                  
                  <div className="text-slate-500">Negative Marking</div>
                  <div className="font-medium">{paper.negativeMarking ? `Yes (${paper.negativeMarks})` : 'No'}</div>
                </div>

                <div className="mt-4">
                  <div className="text-slate-500 text-sm mb-1">Instructions</div>
                  <div className="text-sm bg-slate-50 p-3 rounded-md border text-slate-700">
                    {paper.instructions || 'No instructions provided.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-0">
          <PaperPreview paper={paper} />
        </TabsContent>
        
        <TabsContent value="blueprint" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DifficultyDistribution blueprint={paper.blueprint} />
            <MarksDistribution blueprint={paper.blueprint} />
          </div>
        </TabsContent>
        
        <TabsContent value="statistics" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-slate-500">
                Detailed statistics visualizations will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                      <path d="M12 10v2H7V8.496a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V12H0V4.496a.5.5 0 0 1 .206-.4l5.5-4a.5.5 0 0 1 .588 0l5.5 4a.5.5 0 0 1 .206.4V10Z" />
                    </svg>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">Paper Created</div>
                      <time className="text-xs font-medium text-slate-500">{new Date(paper.createdAt || '').toLocaleDateString()}</time>
                    </div>
                    <div className="text-sm text-slate-500">Initial draft created by {paper.createdBy}</div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                      <path d="M12 10v2H7V8.496a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V12H0V4.496a.5.5 0 0 1 .206-.4l5.5-4a.5.5 0 0 1 .588 0l5.5 4a.5.5 0 0 1 .206.4V10Z" />
                    </svg>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">Submitted for Review</div>
                      <time className="text-xs font-medium text-slate-500">2 days ago</time>
                    </div>
                    <div className="text-sm text-slate-500">Questions finalized and submitted for approval.</div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
