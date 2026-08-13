import { useParams, Link } from 'react-router-dom';
import { SubjectHeader } from '../components/SubjectHeader';
import { SubjectDetailsCard } from '../components/SubjectDetailsCard';
import { SubjectStatistics } from '../components/SubjectStatistics';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Edit, ArrowLeft, BookOpen, FileQuestion, Activity, ListChecks, Loader2 } from 'lucide-react';
import { useSubjectDetail } from '../hooks/subject.hooks';
import type { Subject } from '../types';

export function SubjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSubjectDetail(id || '');

  const subject: Subject | undefined = data?.data && 'id' in data.data ? (data.data as Subject) : (data as unknown as Subject);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !subject) {
    return (
      <div className="p-6 text-center text-red-500">
        Subject not found or failed to load.
        <div className="mt-4">
          <Link to="/company/subjects">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <SubjectHeader
        title="Subject Details"
        description={`Detailed view and configuration for ${subject.code || subject.name}`}
        actions={
          <>
            <Link to="/company/subjects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </Link>
            <Link to={`/company/subjects/${id}/edit`}>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Subject
              </Button>
            </Link>
          </>
        }
      />

      <SubjectStatistics />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger value="general" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            <BookOpen className="h-4 w-4 mr-2" />
            General Information
          </TabsTrigger>
          <TabsTrigger value="exams" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            <ListChecks className="h-4 w-4 mr-2" />
            Exam Mapping
          </TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            <FileQuestion className="h-4 w-4 mr-2" />
            Question Statistics
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">
            <Activity className="h-4 w-4 mr-2" />
            Activity Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <SubjectDetailsCard subject={subject} />
        </TabsContent>
        
        <TabsContent value="exams" className="mt-0">
          <div className="bg-white border rounded-md p-12 text-center text-gray-500">
            Exam mapping module data will appear here.
          </div>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-0">
          <div className="bg-white border rounded-md p-12 text-center text-gray-500">
            Question statistics and analytics will appear here.
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <div className="bg-white border rounded-md p-12 text-center text-gray-500">
            Audit logs and activity timeline for this subject will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
