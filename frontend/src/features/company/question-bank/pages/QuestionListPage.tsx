import { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle, Upload, Download, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuestionStatistics } from '../components/QuestionStatistics';
import { QuestionFilters } from '../components/QuestionFilters';
import { QuestionTable } from '../components/QuestionTable';
import { GenericPagination } from '@/shared/components/pagination/GenericPagination';
import { useQuestionList, useDeleteQuestion, extractQuestions, extractQuestionsTotal } from '../hooks/question.hooks';

export function QuestionListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuestionList({ page, limit });
  const deleteQuestion = useDeleteQuestion();

  const questions = extractQuestions(data);
  const total = extractQuestionsTotal(data);

  const approved = questions.filter(q => q.approvalStatus === 'Approved').length;
  const pending = questions.filter(q => q.approvalStatus === 'Pending').length;
  const rejected = questions.filter(q => q.approvalStatus === 'Rejected').length;
  const draft = questions.filter(q => q.status === 'Draft').length;

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Question Bank" 
          description="Manage and organize your examination questions." 
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/company/question-bank/bulk-upload')}>
            <Upload className="w-4 h-4 mr-2" /> Bulk Upload
          </Button>
          <Button variant="outline" onClick={() => navigate('/company/question-bank/import')}>
            <Download className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button onClick={() => navigate('/company/question-bank/create')}>
            <PlusCircle className="w-4 h-4 mr-2" /> Create Question
          </Button>
        </div>
      </div>

      <QuestionStatistics 
        total={total} 
        approved={approved} 
        pending={pending} 
        rejected={rejected} 
        draft={draft} 
      />

      <QuestionFilters />

      {isLoading ? (
        <div className="flex justify-center items-center h-48 border rounded-md bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <QuestionTable questions={questions} onDelete={handleDelete} />
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

