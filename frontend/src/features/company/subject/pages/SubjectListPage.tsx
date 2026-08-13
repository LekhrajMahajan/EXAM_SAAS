import { useState } from 'react';
import { SubjectHeader } from '../components/SubjectHeader';
import { SubjectFilters } from '../components/SubjectFilters';
import { SubjectTable } from '../components/SubjectTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubjectList, useDeleteSubject } from '../hooks/subject.hooks';
import { GenericPagination } from '@/shared/components/pagination/GenericPagination';
import type { Subject } from '../types';

export function SubjectListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useSubjectList({ page, limit });
  const deleteSubjectMutation = useDeleteSubject();

  const rawData = data?.data as undefined | Subject[] | { items?: Subject[]; total?: number };
  const subjects: Subject[] = Array.isArray(data)
    ? (data as unknown as Subject[])
    : (Array.isArray(rawData) ? rawData : (rawData?.items || []));

  const total = Array.isArray(data)
    ? (data as unknown as Subject[]).length
    : (Array.isArray(rawData) ? rawData.length : (rawData?.total || subjects.length));

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      deleteSubjectMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <SubjectHeader
        title="Subject Management"
        description="Manage subjects, exam configurations, and their settings across the platform."
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link to="/company/subjects/create">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Subject
              </Button>
            </Link>
          </>
        }
      />

      <SubjectFilters />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-md bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <SubjectTable subjects={subjects} onDelete={handleDelete} />
      )}

      <GenericPagination
        pageIndex={page - 1}
        totalCount={total}
        pageSize={limit}
        onPageChange={(newPageIndex: number) => setPage(newPageIndex + 1)}
        onPageSizeChange={(s: number) => { setLimit(s); setPage(1); }}
      />
    </div>
  );
}


