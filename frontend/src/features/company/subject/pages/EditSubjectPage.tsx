import { useParams, Link } from 'react-router-dom';
import { SubjectHeader } from '../components/SubjectHeader';
import { SubjectForm } from '../components/SubjectForm';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSubjectDetail } from '../hooks/subject.hooks';
import type { Subject } from '../types';

export function EditSubjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useSubjectDetail(id || '');

  const subject: Subject | undefined = data?.data && 'id' in data.data ? (data.data as Subject) : (data as unknown as Subject);

  if (isLoading || !subject) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <SubjectHeader
        title={`Edit Subject: ${subject.code || subject.name}`}
        description="Update subject details and examination rules."
        actions={
          <Link to={`/company/subjects/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel Edit
            </Button>
          </Link>
        }
      />
      <SubjectForm initialData={subject} isEditing={true} subjectId={id} />
    </div>
  );
}

