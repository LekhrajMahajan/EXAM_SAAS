import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PageHeader } from "@/shared/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import api from "@/services/api";
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export function PaperSetterWorkspace() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkspace = React.useCallback(async () => {
    try {
      const res = await api.get(`/papers/${paperId}/preview`);
      if (res.data?.success) {
        setPaper(res.data.data.paper);
        setQuestions(res.data.data.questions || []);
      } else {
        throw new Error("Failed");
      }
    } catch (err: any) {
      // Mock Data Fallback for Demonstration
      setPaper({
        _id: paperId,
        paperName: "Demonstration Paper Set",
        approvalStatus: "DRAFT",
        examId: {
          examTitle: "Mock Examination 2026",
          subjects: [
            { name: "Mathematics", questions: 25 },
            { name: "Physics", questions: 15 },
            { name: "Chemistry", questions: 10 },
          ]
        }
      });
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [paperId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkspace();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchWorkspace]);

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPaper = () => {
    setIsSubmitDialogOpen(true);
  };

  const confirmSubmitPaper = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/papers/${paperId}/submit-for-approval`, { approvalStatus: 'SUBMITTED' });
      clearAuth();
      navigate('/auth/login');
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit paper set");
      setIsSubmitting(false);
    }
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

  const examSubjects = paper.examId?.subjects || [];
  
  // Calculate total added vs required
  let totalRequired = 0;
  const totalAdded = questions.length;
  examSubjects.forEach((sub: any) => {
    totalRequired += sub.questions;
  });

  const isComplete = totalAdded >= totalRequired && totalRequired > 0;
  const isDraft = paper.approvalStatus === 'DRAFT';

  return (
    <DashboardLayout>
      <PageHeader
        title={`Paper Set: ${paper.paperName}`}
        description={`Exam: ${paper.examId?.examTitle || 'N/A'}`}
        action={
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm py-1">
              {totalAdded} / {totalRequired} Questions Added
            </Badge>
            <div className="text-xs text-amber-500 max-w-xs text-right leading-tight font-medium">
              Note: Submitting this paper will permanently disconnect your account.
            </div>
            <Button
              disabled={!isDraft || !isComplete}
              onClick={handleSubmitPaper}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Paper Set
            </Button>
          </div>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Subjects</CardTitle>
            <CardDescription>Select a subject to add questions.</CardDescription>
          </CardHeader>
          <CardContent>
            {examSubjects.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                No subjects found in the linked exam.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {examSubjects.map((sub: any, i: number) => {
                  const subjectQuestionsCount = questions.filter(
                    (q) => q.sectionCode?.toUpperCase() === sub.name?.toUpperCase()
                  ).length;

                  return (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-1">{sub.name}</CardTitle>
                        <CardDescription>
                          {subjectQuestionsCount} / {sub.questions} Questions Added
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          className="w-full"
                          variant={subjectQuestionsCount >= sub.questions ? "secondary" : "default"}
                          onClick={() => navigate(`/dashboard/paper-setter/workspace/${paperId}/subject/${encodeURIComponent(sub.name)}`)}
                        >
                          {subjectQuestionsCount >= sub.questions ? "View Questions" : "Add Questions"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Paper Set</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this paper set? This action cannot be undone. 
              Once submitted, your paper setter account session will permanently end and you will be logged out.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={confirmSubmitPaper} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
