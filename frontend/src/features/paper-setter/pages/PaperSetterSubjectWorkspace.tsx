import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PageHeader } from "@/shared/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, Plus, ArrowLeft, Trash2, Edit2, AlertCircle, UploadCloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import api from "@/services/api";
import { AddQuestionModal } from "@/features/paper-setter/components/AddQuestionModal";
import { BulkAddQuestionModal } from "@/features/paper-setter/components/BulkAddQuestionModal";

export function PaperSetterSubjectWorkspace() {
  const { paperId, subjectName } = useParams<{ paperId: string, subjectName: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const fetchWorkspace = React.useCallback(async () => {
    try {
      const res = await api.get(`/papers/${paperId}/preview`);
      if (res.data?.success) {
        setPaper(res.data.data.paper);
        // Filter questions by this specific subject
        const decodedSubject = decodeURIComponent(subjectName || "");
        const allQuestions = res.data.data.questions || [];
        setQuestions(allQuestions.filter((q: any) => q.sectionCode?.toUpperCase() === decodedSubject.toUpperCase()));
      } else {
        throw new Error("Failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch paper details.");
    } finally {
      setIsLoading(false);
    }
  }, [paperId, subjectName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkspace();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchWorkspace]);


  const handleDelete = async (questionId: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/papers/${paperId}/questions/${questionId}`);
      fetchWorkspace();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete question");
    }
  };

  const handleEdit = (q: any) => {
    setEditingQuestion(q);
    setIsAddModalOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !paper) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Paper set not found."}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const decodedSubject = decodeURIComponent(subjectName || "");
  const subjectConfig = paper.examId?.subjects?.find((s: any) => s.name === decodedSubject);
  const targetQuestions = subjectConfig?.questions || 0;
  
  const isDraft = paper.approvalStatus === 'DRAFT';
  const limitReached = questions.length >= targetQuestions;

  return (
    <DashboardLayout>
      <PageHeader
        title={`Subject: ${decodedSubject}`}
        description={`Paper Set: ${paper.paperName}`}
        action={
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(`/dashboard/paper-setter`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Badge variant="outline" className="text-sm py-1 font-medium">
              {questions.length} / {targetQuestions} Questions
            </Badge>
            {isDraft && (
              <>
                <Button 
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsAddModalOpen(true);
                  }} 
                  size="sm"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  disabled={limitReached}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
                <Button 
                  onClick={() => setIsBulkModalOpen(true)} 
                  size="sm" 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  disabled={limitReached}
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Bulk Add
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Manage questions for {decodedSubject}.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                No questions added to this subject yet.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={q._id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm text-muted-foreground mb-1">
                        Question {i + 1}
                      </div>
                      {isDraft && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEdit(q)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(q.questionId?._id || q.questionId || q._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none mb-3" dangerouslySetInnerHTML={{ __html: q.questionId?.question || q.questionId?.text || q.question || q.text }} />
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      {(q.questionId?.options || q.options)?.map((opt: any, optIndex: number) => (
                        <div key={optIndex} className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${opt.isCorrect ? 'bg-primary/90 border-primary text-primary-foreground font-medium' : 'bg-background border-border text-foreground hover:bg-muted/50'}`}>
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                          <span dangerouslySetInnerHTML={{ __html: opt.optionText || opt.text }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isAddModalOpen && (
        <AddQuestionModal 
          key={editingQuestion ? (editingQuestion.questionId?._id || editingQuestion._id) : 'new'}
          isOpen={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingQuestion(null);
          }} 
          paperId={paperId || ""} 
          subjectName={decodedSubject}
          onSuccess={fetchWorkspace}
          editData={editingQuestion}
        />
      )}

      {isBulkModalOpen && (
        <BulkAddQuestionModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          paperId={paperId || ""}
          subjectName={decodedSubject}
          remainingQuota={Math.max(0, targetQuestions - questions.length)}
          onSuccess={fetchWorkspace}
        />
      )}
    </DashboardLayout>
  );
}
